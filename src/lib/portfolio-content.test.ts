import { describe, expect, test } from "bun:test";
import { canReadMedia, contactSchema, projectInputSchema, validateUpload } from "./portfolio-content";

describe("portfolio privacy and validation", () => {
  test("private files never qualify for public access", () => expect(canReadMedia(false, true)).toBe(false));
  test("draft project media stays private even when marked public", () => expect(canReadMedia(true, false)).toBe(false));
  test("published standalone certificates may be public", () => expect(canReadMedia(true, null)).toBe(true));
  test("contact email must be valid", () => expect(contactSchema.safeParse({name:"Ahmad",email:"not-an-email",subject:"Hello",message:"A genuine message",website:""}).success).toBe(false));
  test("only safe image and PDF file formats are accepted", () => expect(validateUpload({type:"image/svg+xml",size:100})).not.toBeNull());
  test("images larger than 10 MB are rejected", () => expect(validateUpload({type:"image/png",size:10*1024*1024+1})).not.toBeNull());
  test("PDFs larger than 20 MB are rejected", () => expect(validateUpload({type:"application/pdf",size:20*1024*1024+1})).not.toBeNull());
  test("project URLs reject script protocols", () => {
    const result = projectInputSchema.shape.live_url.safeParse("javascript:alert(1)");
    expect(result.success).toBe(false);
  });
});