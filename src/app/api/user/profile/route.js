// src/app/api/user/profile/route.js
import { connectDB, getConnectionStatus } from '@/lib/mongodb';
import CustomerTable from '@/models/CustomerTable';
import PropertyUnit from '@/models/PropertyUnit';
import mongoose from 'mongoose';

export async function GET(request) {
  try {
    const connectionStatus = getConnectionStatus();
    if (connectionStatus !== 1) {
      await connectDB();
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const userId = searchParams.get('userId');

    if (!email && !userId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Email or User ID parameter is required',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let searchCriteria = {};
    if (email) {
      searchCriteria.email = email.toLowerCase().trim();
    } else if (userId) {
      searchCriteria._id = mongoose.Types.ObjectId.isValid(userId)
        ? new mongoose.Types.ObjectId(userId)
        : userId;
    }

    const user = await CustomerTable.findOne(searchCriteria)
      .select('-password')
      .populate('propertyUnit'); // ✅ populate property unit

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'User not found',
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ✅ If propertyUnit exists, extract meter_id
    let meterId = '';
    if (user.propertyUnit) {
      meterId = user.propertyUnit.meter_id || '';
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          propertyName: user.propertyName,
          propertyUnit: user.propertyUnit?._id || null,
          accountStatus: user.accountStatus,
          isActive: user.isActive,
          meterId, // ✅ now properly fetched
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('User profile error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        details:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST() {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Method not allowed',
    }),
    { status: 405, headers: { 'Content-Type': 'application/json' } }
  );
}

export async function PUT(request) {
  try {
    const connectionStatus = getConnectionStatus();
    if (connectionStatus !== 1) {
      await connectDB();
    }

    const { userId, updates } = await request.json();
    if (!userId || !updates) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'User ID and updates are required',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const allowedUpdates = ['name', 'phone', 'address', 'meterId'];
    const validUpdates = {};
    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        validUpdates[key] = updates[key];
      }
    });

    if (Object.keys(validUpdates).length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'No valid fields to update' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    validUpdates.updatedAt = new Date();

    const userObjectId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const updatedUser = await CustomerTable.findByIdAndUpdate(
      userObjectId,
      { $set: validUpdates },
      { new: true, runValidators: true }
    )
      .select('-password')
      .populate('propertyUnit');

    if (!updatedUser) {
      return new Response(
        JSON.stringify({ success: false, error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let meterId = '';
    if (updatedUser.propertyUnit) {
      meterId = updatedUser.propertyUnit.meter_id || '';
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: updatedUser._id.toString(),
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          address: updatedUser.address,
          role: updatedUser.role,
          propertyName: updatedUser.propertyName,
          propertyUnit: updatedUser.propertyUnit?._id || null,
          meterId,
          updatedAt: updatedUser.updatedAt,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Profile update error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE() {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Method not allowed',
    }),
    { status: 405, headers: { 'Content-Type': 'application/json' } }
  );
}
