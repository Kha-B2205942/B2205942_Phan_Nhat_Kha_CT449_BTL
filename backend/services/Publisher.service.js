const { ObjectId } = require("mongodb");

class PublisherService {
    constructor(client) {
    this.NXB = client.db().collection("nhaxuatban");
  }

  extractNXBData(payload) {
    const nxb = {
      MaNXB: payload.MaNXB,
      TenNXB: payload.TenNXB,
      DiaChi: payload.DiaChi,
    };
    Object.keys(nxb).forEach(
      (key) => nxb[key] === undefined && delete nxb[key]
    );
    return nxb;
  }

    async create(payload) {
        const nxb = this.extractNXBData(payload);
        const existing = await this.NXB.findOne({ MaNXB: nxb.MaNXB });
        if (existing) {
            throw new Error(`Mã độc giả ${nxb.MaNXB} đã tồn tại`);
        }
        const result = await this.NXB.insertOne(nxb);
        if (result.acknowledged) {
            return nxb;
        }
        return null;
    }

    async find(filter) {
        const cursor = await this.NXB.find(filter);
        return await cursor.toArray();
    }

    async findByName(TenNXB) {
        return await this.find({
        TenNXB: { $regex: new RegExp(TenNXB, "i") },
        });
    }

    async findByMaNXB(MaNXB) {
    return await this.NXB.findOne({ MaNXB: MaNXB });
    }

    async update(MaNXB, payload) {
        const update = this.extractNXBData(payload);
        const result = await this.NXB.findOneAndUpdate(
            { MaNXB: MaNXB },
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(MaNXB) {
        const result = await this.NXB.findOneAndDelete({
            MaNXB: MaNXB
        });
        return result;
    }

    async deleteAll() {
        const result = await this.NXB.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = PublisherService;
