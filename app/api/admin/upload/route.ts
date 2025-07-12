import { NextRequest, NextResponse } from 'next/server';
import formidable, { File } from 'formidable';
import { put } from '@vercel/blob';
import dbConnect from '@/lib/mongodb';
import Photo from '@/models/Photo';

export const config = {
  api: { bodyParser: false },
};

export async function POST(req: NextRequest) {
  await dbConnect();

  const form = new formidable.IncomingForm();

  return new Promise((resolve) => {
    form.parse(req as any, async (err, fields, files) => {
      if (err) return resolve(NextResponse.json({ error: 'Form parsing failed' }, { status: 500 }));

      try {
        const file = (files.image?.[0] as File) || null;
        if (!file) return resolve(NextResponse.json({ error: 'No image uploaded' }, { status: 400 }));

        const blob = await put(file.originalFilename || 'upload.jpg', file.filepath, {
          access: 'public',
          token: process.env.BLOB_READ_WRITE_TOKEN!,
        });

        const newPhoto = new Photo({
          title: fields.title?.[0],
          description: fields.description?.[0],
          imageUrl: blob.url,
          createdAt: new Date(),
        });

        await newPhoto.save();

        resolve(NextResponse.json(newPhoto, { status: 200 }));
      } catch (error: any) {
        console.error('Upload error:', error.message);
        resolve(NextResponse.json({ error: 'Upload failed' }, { status: 500 }));
      }
    });
  });
}
