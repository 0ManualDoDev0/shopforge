import { createUploadthing, type FileRouter } from "uploadthing/next";
import { createRouteHandler } from "uploadthing/next";
import { auth } from "@/lib/auth";

const f = createUploadthing();

const fileRouter = {
  productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
    .middleware(async () => {
      const session = await auth();
      const role = (session?.user as { role?: string } | undefined)?.role;
      if (role !== "ADMIN") throw new Error("Unauthorized");
      return { userId: session!.user!.id };
    })
    .onUploadComplete(({ file }) => {
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof fileRouter;

export const { GET, POST } = createRouteHandler({ router: fileRouter });
