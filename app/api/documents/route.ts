import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { parseDocument } from '@/lib/services/parser';
import { chunkDocument } from '@/lib/services/chunker';
import { generateEmbeddings } from '@/lib/services/embeddings';
import { analyzeDocumentAndSave } from '@/lib/services/analyzer';

const MAX_FILE_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10);
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export async function GET() {
  const user = await getAuthSession();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const documents = await prisma.document.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      fileName: true,
      fileType: true,
      fileSize: true,
      status: true,
      pageCount: true,
      isDemo: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return NextResponse.json({ documents });
}

export async function POST(req: Request) {
  const user = await getAuthSession();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // 1. File Validation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: `File size exceeds the ${MAX_FILE_SIZE_MB}MB limit.` }, { status: 400 });
    }

    const fileName = file.name;
    const ext = fileName.split('.').pop()?.toLowerCase();
    const allowedExts = ['pdf', 'docx', 'txt'];

    if (!ext || !allowedExts.includes(ext)) {
      return NextResponse.json({
        error: "We couldn't reliably process this file format. Please upload a PDF, DOCX, or TXT document."
      }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Parse Document Text
    const parsedDoc = await parseDocument(buffer, fileName, file.type);

    if (!parsedDoc.rawText || parsedDoc.rawText.trim().length === 0) {
      return NextResponse.json({
        error: "We couldn't extract text from this document. It may be scanned or empty. Please try another PDF or DOCX file."
      }, { status: 400 });
    }

    // 3. Create Document Record
    const docRecord = await prisma.document.create({
      data: {
        userId: user.id,
        title: parsedDoc.title || fileName.replace(/\.[^/.]+$/, ""),
        fileName,
        fileType: ext,
        fileSize: file.size,
        status: 'extracting',
        pageCount: parsedDoc.pageCount || 1,
        rawText: parsedDoc.rawText
      }
    });

    // 4. Chunk & Store Chunks with Embeddings
    const chunksData = chunkDocument(parsedDoc);
    const chunkTexts = chunksData.map(c => c.content);
    const embeddings = await generateEmbeddings(chunkTexts);

    await prisma.$transaction(
      chunksData.map((c, idx) =>
        prisma.documentChunk.create({
          data: {
            documentId: docRecord.id,
            chunkIndex: c.chunkIndex,
            pageNumber: c.pageNumber,
            section: c.section,
            content: c.content,
            embedding: JSON.stringify(embeddings[idx] || []),
            startOffset: c.startOffset,
            endOffset: c.endOffset
          }
        })
      )
    );

    // 5. Update Status & Run Analysis
    await prisma.document.update({
      where: { id: docRecord.id },
      data: { status: 'analyzing' }
    });

    // Trigger analysis
    await analyzeDocumentAndSave(docRecord.id, parsedDoc);

    return NextResponse.json({
      documentId: docRecord.id,
      status: 'completed',
      message: 'Document analyzed successfully.'
    });

  } catch (err: any) {
    console.error("Document processing error:", err);
    return NextResponse.json({
      error: 'We encountered an error analyzing this document. Please verify the file and try again.'
    }, { status: 500 });
  }
}
