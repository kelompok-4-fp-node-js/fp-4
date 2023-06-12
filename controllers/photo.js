const { photo, user, comment } = require("../models");

module.exports = class {
  static async post(req, res) {
    try {
      const newPhoto = await photo.create({
        ...req.body,
        UserId: req.userLogin.id,
      });

      const secure = JSON.parse(JSON.stringify(newPhoto));
      delete secure.updatedAt;
      delete secure.createdAt;
      res.status(201).json({ Photo: secure });
    } catch (error) {
      res.status(500).json(error);
    }
  }
  static async get(req, res) {
    try {
      const photoData = await photo.findAll({
        where: { UserId: req.userLogin.id },
        include: [
          { model: user, attributes: { exclude: ["password", "createdAt", "updatedAt", "full_name", "email", "age", "phone_number"] } },
          { model: comment, attributes: ["comment"], include: [{ model: user, attributes: ["username"] }] },
        ],
      });

      res.status(200).json({ Photos: photoData });
    } catch (error) {
      res.status(500).json(error);
    }
  }
    static async put(req, res){
      try {
          const photoData = await photo.findOne({where:{id: req.params.id}})

          if (!photoData) {
              res.status(404).json({message: 'Photo not found'})
              return
          }

          if(req.userLogin.id !== photoData.dataValues.UserId){
              res.status(401).json({message: 'This not your photo'})
              return
          }

    const updateData = await photo.update(req.body, { where: { id: req.params.id }, returning: true });
    const dataP = updateData[1];
    res.status(200).json({ photo: dataP[0] });
  } catch (error) {
    res.status(500).json(error);
  }}
    
    static async delete(req, res){
        try {
            const findPhoto = await photo.findOne({where:{id: req.params.id}})
          
            if (!findPhoto) {
                res.status(404).json({message: 'Photo not found'})
                return
            }

            if(req.userLogin.id !== findPhoto.dataValues.UserId){
                res.status(401).json({message: 'This not your photo'})
                return
            }

            const deleteData = await photo.destroy({where: {id: req.params.id},returning: true})
            res.status(200).json({message : "Your photo has been successfully deleted"})

    } catch (error) {
      res.status(500).json(error);
    }
  }
};
