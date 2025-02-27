import jwt from 'jsonwebtoken';

export function getDataFromToken(request) {
  try {
    const token = request.cookies.get('token')?.value; // Get token from cookies

    if (!token) {
      throw new Error('JWT must be provided'); // Handle missing token
    }

    // Verify token using secret key
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    return decoded.id; // Return user ID from token
  } catch (error) {
    throw new Error(error.message); // Pass the error up to the caller
  }
}
