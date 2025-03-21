const Exchange = require('../Models/ExchangeModel');
const UserModel = require('../Models/UserModel');
const User = require('../Models/UserModel');

module.exports.buyStock = async (req, res) => {
    try{
        const { UserId, Type, Price, Qty, Name, Time, ExchangeId } = req.body;

        if(!UserId || !Type || !Price || !Qty || !Name || !Time || !ExchangeId){
            return res.status(400).json({ msg: "Please enter all fields" });
        }

        const ex = await Exchange.findOne({ ExchangeId });

        if(!ex){
            return res.status(400).json({ msg: "Exchange does not exist" });
        }

        const exchange = new Exchange({
            UserId,
            Type,
            Price,
            Qty,
            Name,
            Time,
            ExchangeId
        });

        await exchange.save();

        return res.status(200).json({ 
            msg: "Stock bought successfully",
            exchange: exchange
        });
    }
    catch(err){
        console.error("Buy error:", err);
        return res.status(500).json({ msg: "Server error during buy" });
    }
}

module.exports.sellStock = async (req, res) => {
    try{
        const { UserId, Type, Price, Qty, Name, Time, ExchangeId } = req.body;

        if(!UserId || !Type || !Price || !Qty || !Name || !Time || !ExchangeId){
            return res.status(400).json({ msg: "Please enter all fields" });
        }

        const user = await User.findOne({ _id: UserId });

        if(!user){
            return res.status(400).json({ msg: "User does not exist" });
        }

        const exchange = new Exchange({
            UserId,
            Type,
            Price,
            Qty,
            Name,
            Time,
            ExchangeId
        });

        await exchange.save();

        UserModel.findOneAndUpdate({
            Username 
        })
        return res.status(200).json({ 
            msg: "Stock sold successfully",
            exchange: exchange
        });
    }
    catch(err){
        console.error("Sell error:", err);
        return res.status(500).json({ msg: "Server error during sell" });
    }
}


module.exports.getHistory = async (req, res) => {
    try{
        const { ExchangeId } = req.body;

        if(!ExchangeId){
            return res.status(400).json({ msg: "Please enter all fields" });
        }

        const user = await User.findOne({ _id: ExchangeId });

        if(!user){
            return res.status(400).json({ msg: "User does not exist" });
        }

        const history = await Exchange.findOne({ ExchangeId });

        return res.status(200).json({ 
            msg: "History fetched successfully",
            history: history
        });
    }
    catch(err){
        console.error("History error:", err);
        return res.status(500).json({ msg: "Server error during history" });
    }
}