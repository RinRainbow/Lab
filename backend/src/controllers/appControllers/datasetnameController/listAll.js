const listAll = async (Model, req, res) => {
    const sort = parseInt(req.query.sort) || 'desc';

    //  Query the database for a list of all results
    const result = await Model.find({$or: [
      { isPublic: true },
      { createdBy: req.admin._id }
  ]})
  .sort({ created: sort })
  .populate()
  .exec();

    console.log(result);
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        result,
        message: 'Successfully found all documents',
      });
    } else {
      return res.status(203).json({
        success: false,
        result: [],
        message: 'Collection is Empty',
      });
    }
  };
  
  module.exports = listAll;
  