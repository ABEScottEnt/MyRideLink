'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      // Define associations
      Review.belongsTo(models.Ride, {
        foreignKey: 'ride_id',
        as: 'ride'
      });
      Review.belongsTo(models.User, {
        foreignKey: 'reviewer_id',
        as: 'reviewer'
      });
      Review.belongsTo(models.User, {
        foreignKey: 'reviewee_id',
        as: 'reviewee'
      });
    }
  }

  Review.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    rideId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'ride_id',
      references: {
        model: 'Rides',
        key: 'id'
      }
    },
    reviewerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'reviewer_id',
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    revieweeId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'reviewee_id',
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category: {
      type: DataTypes.ENUM('driver', 'rider'),
      allowNull: false
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_public'
    },
    status: {
      type: DataTypes.ENUM('active', 'flagged', 'removed'),
      defaultValue: 'active'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at'
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at'
    }
  }, {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    paranoid: true,
    underscored: true,
    indexes: [
      {
        fields: ['ride_id']
      },
      {
        fields: ['reviewer_id']
      },
      {
        fields: ['reviewee_id']
      },
      {
        fields: ['category']
      },
      {
        fields: ['rating']
      }
    ]
  });

  return Review;
}; 