// extractor.js
//comment
module.exports = function extractor(request, id) {
    const { method, path } = request;
    const segments = path.split("/");
    console.log(`Path: ${path}`);
    console.log(`Segments: ${segments}`);
    return segments[id];
};