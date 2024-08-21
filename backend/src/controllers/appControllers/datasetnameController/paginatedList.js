const paginatedList = async (Model, req, res) => {
  try {
    const fieldsArray = req.query.fields
      ? req.query.fields.split(',')
      : ['datasetName'];
    const sort = req.query.sort || 'desc';
    
    // Construct the search query
    const query = {
      $or: fieldsArray.map(field => ({
        [field]: { $regex: new RegExp(req.query.q, 'i') }
      }))
    };
    
    const page = parseInt(req.query.page) || 1;
    const limit = 1;
    const skip = (page - 1) * limit;
    // Query the database
    const [result, totalCount] = await Promise.all([
      Model.find(query)
        .sort({ created: sort })
        .exec(),
      Model.countDocuments(query)
    ]);
    const pages = Math.ceil(totalCount / limit);
    // Getting Pagination Object
    const pagination = { page, pages, totalCount };
    if (totalCount > 0) {
      return res.status(200).json({
        success: true,
        result,
        pagination,
        message: 'Successfully found all documents',
      });
    } else {
      return res.status(204).json({
        success: false,
        result: [],
        pagination,
        message: 'Collection is Empty',
      });
    }
  } catch (error) {
    console.error('Error in paginatedList:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

module.exports = paginatedList;