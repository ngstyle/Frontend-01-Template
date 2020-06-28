class TrieNode {
  constructor() {
    this.links = new Map();
    // this.links = [];
    this.end = false;
    this.count = 0;
  }

  containsKey(ch) {
    return this.links.has(ch);
    // return this.links[ch.charCodeAt(0) - "a".charCodeAt(0)] !== undefined;
  }

  get(ch) {
    return this.links.get(ch);
    // return this.links[ch.charCodeAt(0) - "a".charCodeAt(0)];
  }

  put(ch, trie) {
    this.links.set(ch, trie);
    // this.links[ch.charCodeAt(0) - "a".charCodeAt(0)] = trie;
  }

  setEnd() {
    this.end = true;
  }

  isEnd() {
    return this.end;
  }

  visit() {
    this.count++;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;
    for (const c of word) {
      if (!node.containsKey(c)) {
        node.put(c, new TrieNode());
      }

      node = node.get(c);
      node.visit();
    }
    node.setEnd();
  }

  searchPrefix(word) {
    let node = this.root;
    for (const c of word) {
      if (node.containsKey(c)) {
        node = node.get(c);
      } else {
        return null;
      }
    }
    return node;
  }

  search(word) {
    const node = this.searchPrefix(word);
    return node !== null && node.isEnd();
  }

  startsWith(word) {
    const node = this.searchPrefix(word);
    return node !== null;
  }
}

let trie = new Trie();
trie.insert("apple");
console.log(trie.search("apple"));
console.log(trie.search("app"));
console.log(trie.startsWith("app"));

trie.insert("app");
console.log(trie.startsWith("app"));
console.log(trie);
