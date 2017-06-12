module.exports = function(sequelize, DataTypes) {
    var Property = sequelize.define("Property", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            notNull: true,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            notNull: true,
            allowNull: false
        },
        isOwned: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        owner: {
            type: DataTypes.STRING
        },
        price: {
            type: DataTypes.INTEGER
        },
        rent: {
            type: DataTypes.INTEGER
        },
        monopoly: {
            type: DataTypes.INTEGER
        },
        rentOne: {
            type: DataTypes.INTEGER
        },
        rentTwo: {
            type: DataTypes.INTEGER
        },
        rentThree: {
            type: DataTypes.INTEGER
        },
        rentFour: {
            type: DataTypes.INTEGER
        },
        rentHotel: {
            type: DataTypes.INTEGER
        },
        mortgage: {
            type: DataTypes.INTEGER,
        },
        isMortgaged: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    }, {
        timestamps: false
    });
    return Property;
};
