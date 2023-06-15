const { SocialMedia, user } = require("../models");

module.exports = class {
  static async post(req, res) {
    try {
      const newSosmed = await SocialMedia.create({
        ...req.body,
        UserId: req.userLogin.id,
      });

      res.status(201).json({ Social_Media: newSosmed });
    } catch (error) {
      res.status(500).json(error);
    }
  }
  static async get(req, res) {
    try {
      const sosmedData = await SocialMedia.findAll({
        where: { UserId: req.userLogin.id },
        include: { model: user, attributes: { exclude: ["password", "createdAt", "updatedAt", "full_name", "email", "age", "phone_number"] } },
      });

      res.status(200).json({ Social_Medias: sosmedData });
    } catch (error) {
      res.status(500).json(error);
    }
  }
  static async put(req, res) {
    try {
      const sosmedData = await SocialMedia.findOne({ where: { id: req.params.id } });

      if (req.userLogin.id !== sosmedData.dataValues.UserId) {
        res.status(401).json({ message: "This not your social media" });
        return;
      }

      const updateData = await SocialMedia.update(req.body, { where: { id: req.params.id }, returning: true });
      const sosmedPut = updateData[1];
      res.status(200).json({ Social_Media: sosmedPut[0] });
    } catch (error) {
      res.status(500).json(error);
    }
  }
  static async delete(req, res) {
    try {
      const findSosmed = await SocialMedia.findOne({ where: { id: req.params.id } });
      console.log(findSosmed);
      if (findSosmed === null) {
        res.status(404).json({ message: "data with id " + req.params.id + " not found" });
        return;
      }
      if (req.userLogin.id !== findSosmed.dataValues.UserId) {
        res.status(401).json({ message: "This not your social media" });
        return;
      }

      const deleteData = await SocialMedia.destroy({ where: { id: req.params.id }, returning: true });
      res.status(200).json({ message: "Your social media has been successfully deleted" });
    } catch (error) {
      res.status(500).json(error);
    }
  }
};
