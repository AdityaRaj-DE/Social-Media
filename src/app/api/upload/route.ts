import cloudinary from "../../../lib/cloudinary";
import { getCurrentUser } from "../../../lib/auth";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return Response.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result: any = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "socialmedia" }, (err, res) => {
        if (err) reject(err);
        resolve(res);
      })
      .end(buffer);
  });

  return Response.json({
    url: result.secure_url,
    publicId: result.public_id,
  });
}
