import { generateUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/upload/route";

export const UploadButton = generateUploadButton<OurFileRouter>();
