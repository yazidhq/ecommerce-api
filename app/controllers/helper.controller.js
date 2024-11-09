const fs = require("fs");

const deleteOldFiles = (oldFilePaths) => {
  oldFilePaths.forEach((filePath) => {
    const localFilePath = filePath.replace("http://localhost:3000", "./public");
    fs.unlink(localFilePath, (err) => {
      if (err) {
        console.error(`Error deleting file ${localFilePath}:`, err);
      } else {
        console.log(`File ${localFilePath} deleted successfully`);
      }
    });
  });
};

module.exports = { deleteOldFiles };
