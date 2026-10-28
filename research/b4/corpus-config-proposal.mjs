// Current corpus identity and file locations only; no reference/storage migration.
export const corpusConfig = Object.freeze({
 id:'bible', displayName:'Bible', canon:'protestant-66',
 files:Object.freeze({books:'data/books.json',chapters:'data/chapters.json',evidence:'data/evidence.json'}),
 units:Object.freeze({collection:'book',section:'chapter',segment:'verse'}),
 editions:Object.freeze(['web','kjv','asv']),
 legacyReferences:true,
});
