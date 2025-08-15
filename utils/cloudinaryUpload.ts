export type ResourceType = "image" | "video" | "auto";

export interface UploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  resourceType?: string;
  waveformUrl?: string;
  error?: string;
}

/**
 * CLIENT-SIDE: Upload file to Cloudinary using unsigned preset
 * Use this in React components and browser code
 */
export async function uploadToCloudinary(
  file: File,
  folder: string,
  publicId: string,
  resourceType: ResourceType = "auto"
): Promise<UploadResult> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "MuzupApp");

    formData.append("folder", folder);
    formData.append("public_id", publicId);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();

    // Generate waveform URL for audio files
    let waveformUrl: string | undefined;

    // Check if the uploaded file is actually audio
    const isAudioFile =
      result.resource_type === "video" &&
      (result.format === "mp3" ||
        result.format === "wav" ||
        result.format === "m4a" ||
        result.format === "aac" ||
        result.format === "ogg" ||
        result.format === "flac");

    if (isAudioFile) {
      // Use the actual format from the upload result
      waveformUrl = `https://res.cloudinary.com/${cloudName}/video/upload/e_waveform,w_800,h_150,c_scale,f_png/${result.public_id}.${result.format}`;
    }

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      waveformUrl,
    };
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return { success: false, error: error.message };
  }
}
