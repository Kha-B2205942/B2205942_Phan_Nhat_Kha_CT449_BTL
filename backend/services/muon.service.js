const { ObjectId } = require("mongodb");

class MuonService {
    constructor(client) {
        this.Muon = client.db().collection("theodoimuonsach");
    }

    extractMuonData(payload) {
        const muon = {
            MaDocGia: payload.MaDocGia,
            MaSach: payload.MaSach,
            NgayMuon: payload.NgayMuon,
            NgayTra: payload.NgayTra,
            TinhTrang: payload.TinhTrang,
        };
        Object.keys(muon).forEach(
            (key) => muon[key] === undefined && delete muon[key]
        );
        return muon;
    }

    async create(payload) {
        const muon = this.extractMuonData(payload);
        const result = await this.Muon.insertOne(muon);
        if (result.acknowledged) {
            return Muon;
        }
        return null;
    }

    async find(filter) {
        const cursor = await this.Muon.find(filter);
        return await cursor.toArray();
    }

    async findById(id) {
        return await this.Muon.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
        const update = this.extractMuonData(payload);
        const result = await this.Muon.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.Muon.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async deleteAll() {
        const result = await this.Muon.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = MuonService;
