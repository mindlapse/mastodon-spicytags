export default class Tags {
  private spicyTags: Set<string>;

  constructor(spicyTags: string[]) {
    this.spicyTags = new Set(spicyTags);
  }

  /*
  Get the intersection of the given tags with the spicyTags as an array
  */
  getSpicyTags(tags: NameUrl[]) {
    const found = [];
    for (let tag of tags) {
      let tagName = tag.name.toLowerCase();
      if (this.spicyTags.has(tagName)) {
        found.push(tagName);
      }
    }
    return found;
  }
}

interface NameUrl {
  name: string;
  url: string;
}
