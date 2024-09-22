const updateAll = async (Model, req, res) => {
  let errormeg = [];
  try {
    console.log(req.body);
      const results = await Promise.all(req.body.map(async (element) => {
          try {
              const result = await Model.updateOne({ _id: element["_id"] }, element, {
                  new: true, // return the new result instead of the old one
                  runValidators: true,
              });
              console.log(element);
              return result;
          } catch (err) {
              errormeg.push(err);
              return { error: err.message };
          }
      }));

      if (errormeg != 0) {
          return res.status(404).json({
              success: false,
              result: null,
              message: 'Some documents could not be updated:' + errormeg,
          });
      } else {
          return res.status(200).json({
              success: true,
              result: results,
              message: 'All documents were updated successfully',
          });
      }
  } catch (error) {
      return res.status(500).json({
          success: false,
          result: null,
          message: `Error updating documents: ${error.message}`,
      });
  }
};

module.exports = updateAll;
