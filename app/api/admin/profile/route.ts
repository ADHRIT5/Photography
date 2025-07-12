import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Profile from '@/models/Profile';

export async function POST(req: NextRequest) {
  await dbConnect();
  const { imageUrl } = await req.json();

  if (!imageUrl) return NextResponse.json({ error: 'Missing image URL' }, { status: 400 });

  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile({ imageUrl });
    } else {
      profile.imageUrl = imageUrl;
    }
    await profile.save();
    return NextResponse.json(profile, { status: 200 });
  } catch (error: any) {
    console.error('Profile update error:', error.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
