const Exchange = require('../Models/ExchangeModel');
const User = require('../Models/UserModel');
const Holding = require('../Models/HoldingModel');

module.exports.buyStock = async (req, res) => {
    try {
        const { UserId, Type, Price, Qty, Name, Symbol, Time, ExchangeId, HoldingId } = req.body;

        // Validate required fields
        if (!UserId || !Type || !Price || !Qty || !Name || !Symbol || !Time || !ExchangeId || !HoldingId) {
            return res.status(400).json({ msg: "Please enter all fields" });
        }

        // Find user
        const user = await User.findOne({ _id: UserId });
        if (!user) {
            return res.status(400).json({ msg: "User does not exist" });
        }

        // Check user balance
        if (Price * Qty > user.Balance) {
            return res.status(400).json({ msg: "Insufficient balance" });
        }

        // Create a new transaction record
        const transaction = {
            UserId,
            Type,
            Price,
            Qty,
            Name,
            Symbol,
            Time,
            createdAt: new Date()
        };

        // Find or create the exchange document
        let exchange = await Exchange.findOne({ ExchangeId });
        
        if (!exchange) {
            exchange = new Exchange({
                ExchangeId,
                AllExchanges: [transaction]
            });
        } else {
            // Add the new transaction to the existing exchange history
            exchange.AllExchanges.push(transaction);
        }

        // Update the user holding
        let userHolding = await Holding.findOne({ HoldingId });

        if (!userHolding) {
            // Create new holding document if none exists
            userHolding = new Holding({
                HoldingId,
                Holdings: [{
                    Name,
                    Symbol,
                    Quantity: Qty,
                    Price
                }]
            });
        } else {
            // Check if the symbol already exists in holdings
            const existingHoldingIndex = userHolding.Holdings.findIndex(
                holding => holding.Symbol === Symbol
            );

            if (existingHoldingIndex !== -1) {
                // Calculate the average price
                const currentHolding = userHolding.Holdings[existingHoldingIndex];
                const currentTotalValue = currentHolding.Quantity * currentHolding.Price;
                const newTotalValue = Qty * Price;
                const newTotalQuantity = currentHolding.Quantity + Number(Qty);
                const averagePrice = (currentTotalValue + newTotalValue) / newTotalQuantity;
                
                // Update existing holding with average price
                userHolding.Holdings[existingHoldingIndex].Quantity += Number(Qty);
                userHolding.Holdings[existingHoldingIndex].Price = averagePrice;
                userHolding.Holdings[existingHoldingIndex].Date = Date.now();
            } else {
                // Add new holding
                userHolding.Holdings.push({
                    Name,
                    Symbol,
                    Quantity: Qty,
                    Price
                });
            }
        }

        // Update user balance
        user.Balance -= Price * Qty;

        // Save all changes
        await userHolding.save();
        await exchange.save();
        await user.save();

        return res.status(200).json({
            msg: "Stock bought successfully",
            transaction: transaction,
            holding: userHolding
        });
    }
    catch (err) {
        console.error("Buy error:", err);
        return res.status(500).json({ msg: "Server error during buy" });
    }
};

module.exports.sellStock = async (req, res) => {
    try {
        const { UserId, Type, Price, Qty, Name, Symbol, Time, ExchangeId, HoldingId } = req.body;

        // Validate required fields
        if (!UserId || !Type || !Price || !Qty || !Name || !Symbol || !Time || !ExchangeId || !HoldingId) {
            return res.status(400).json({ msg: "Please enter all fields" });
        }

        // Find user
        const user = await User.findOne({ _id: UserId });
        if (!user) {
            return res.status(400).json({ msg: "User does not exist" });
        }

        // Find holding
        const userHolding = await Holding.findOne({ HoldingId });
        if (!userHolding) {
            return res.status(400).json({ msg: "No holdings found for this user" });
        }

        // Check if user has enough of this stock to sell
        const existingHoldingIndex = userHolding.Holdings.findIndex(
            holding => holding.Symbol === Symbol
        );

        if (existingHoldingIndex === -1) {
            return res.status(400).json({ msg: "You don't own this stock" });
        }

        const currentHolding = userHolding.Holdings[existingHoldingIndex];
        
        if (currentHolding.Quantity < Qty) {
            return res.status(400).json({ msg: "Not enough shares to sell" });
        }

        // Create a new transaction record
        const transaction = {
            UserId,
            Type,
            Price,
            Qty,
            Name,
            Symbol,
            Time,
            createdAt: new Date()
        };

        // Find or create the exchange document
        let exchange = await Exchange.findOne({ ExchangeId });
        
        if (!exchange) {
            exchange = new Exchange({
                ExchangeId,
                AllExchanges: [transaction]
            });
        } else {
            // Add the new transaction to the existing exchange history
            exchange.AllExchanges.push(transaction);
        }

        // Update holdings
        currentHolding.Quantity -= Number(Qty);
        
        // Remove holding if quantity reaches zero
        if (currentHolding.Quantity === 0) {
            userHolding.Holdings.splice(existingHoldingIndex, 1);
        }

        // Update user balance
        user.Balance += Price * Qty;

        // Save all changes
        await exchange.save();
        await userHolding.save();
        await user.save();

        return res.status(200).json({
            msg: "Stock sold successfully",
            transaction: transaction,
            holding: userHolding
        });
    }
    catch (err) {
        console.error("Sell error:", err);
        return res.status(500).json({ msg: "Server error during sell" });
    }
};

module.exports.getHistory = async (req, res) => {
    try {
        const { ExchangeId } = req.body;

        if (!ExchangeId) {
            return res.status(400).json({ msg: "Please enter Exchange ID" });
        }

        const exchange = await Exchange.findOne({ ExchangeId });

        if (!exchange) {
            return res.status(400).json({ msg: "No exchange history found with this ID" });
        }

        return res.status(200).json({
            msg: "Exchange history fetched successfully",
            history: exchange.AllExchanges
        });
    }
    catch (err) {
        console.error("History error:", err);
        return res.status(500).json({ msg: "Server error while fetching history" });
    }
};
 
// IF THE STOCK MARKET IS CLOSE THE REQUEST WILL STORE IN WAITING AND ONCES MARKET GETS OPEN IT WILL EXECUTE THE REQUEST
 module.exports.buyRequest = async (req, res) => {
    try {
        const { UserId, Type, Price, Qty, Name, Symbol, Time, ExchangeId, HoldingId } = req.body;

        // Validate required fields
        if (!UserId || !Type || !Price || !Qty || !Name || !Symbol || !Time || !ExchangeId || !HoldingId) {
            return res.status(400).json({ msg: "Please enter all fields" });
        }

        // Find user
        const user = await User.findOne({ _id: UserId });
        if (!user) {
            return res.status(400).json({ msg: "User does not exist" });
        }

        // Check user balance
        if (Price * Qty > user.Balance) {
            return res.status(400).json({ msg: "Insufficient balance" });
        }

        // Create a new transaction record
        const transaction = {
            UserId,
            Type,
            Price,
            Qty,
            Name,
            Symbol,
            Time,
            createdAt: new Date()
        };

        // Find or create the exchange document
        // let exchange = await Exchange.findOne({ ExchangeId });
        
        if (!exchange) {
            exchange = new Exchange({
                ExchangeId,
                AllExchanges: [transaction]
            });
        } else {
            // Add the new transaction to the existing exchange history
            exchange.AllExchanges.push(transaction);
        }

        // Update the user holding
        let userHolding = await Holding.findOne({ HoldingId });

        if (!userHolding) {
            // Create new holding document if none exists
            userHolding = new Holding({
                HoldingId,
                Holdings: [{
                    Name,
                    Symbol,
                    Quantity: Qty,
                    Price
                }]
            });
        } else {
            // Check if the symbol already exists in holdings
            const existingHoldingIndex = userHolding.Holdings.findIndex(
                holding => holding.Symbol === Symbol
            );

            if (existingHoldingIndex !== -1) {
                // Calculate the average price
                const currentHolding = userHolding.Holdings[existingHoldingIndex];
                const currentTotalValue = currentHolding.Quantity * currentHolding.Price;
                const newTotalValue = Qty * Price;
                const newTotalQuantity = currentHolding.Quantity + Number(Qty);
                const averagePrice = (currentTotalValue + newTotalValue) / newTotalQuantity;
                
                // Update existing holding with average price
                userHolding.Holdings[existingHoldingIndex].Quantity += Number(Qty);
                userHolding.Holdings[existingHoldingIndex].Price = averagePrice;
                userHolding.Holdings[existingHoldingIndex].Date = Date.now();
            } else {
                // Add new holding
                userHolding.Holdings.push({
                    Name,
                    Symbol,
                    Quantity: Qty,
                    Price
                });
            }
        }

        // Update user balance
        user.Balance -= Price * Qty;

        // Save all changes
        await userHolding.save();
        await exchange.save();
        await user.save();

        return res.status(200).json({
            msg: "Stock bought successfully",
            transaction: transaction,
            holding: userHolding
        });
    }
    catch (err) {
        console.error("Buy error:", err);
        return res.status(500).json({ msg: "Server error during buy" });
    }
 }