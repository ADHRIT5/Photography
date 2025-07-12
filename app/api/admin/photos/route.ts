import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Photo from '@/models/Photo';

export async function GET() {
  await dbConnect();
  const photos = await Photo.find().sort({ createdAt: -1 });
  return NextResponse.json(photos);
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  const { id } = await req.json();

  try {
    await Photo.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
