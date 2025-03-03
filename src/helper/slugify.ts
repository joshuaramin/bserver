import Slugify from "slugify";

export default function (name: string) {
  return Slugify(name, {
    lower: true,
    trim: true,
  });
}
