'use server'

import { DynamoDBClient, PutItemCommand, GetItemCommand, UpdateItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';


const dynamoDBClient = new DynamoDBClient({ region: 'eu-west-1' });




export const PutItem = async (tabname, itemdata) => {

    const marshalledItem = marshall(itemdata);
    const params = {
        TableName: tabname,
        Item: marshalledItem
      };

    try {

        await dynamoDBClient.send(new PutItemCommand(params));
        return true;

      } catch (error) {

        console.error('Error adding item:', JSON.stringify(error, null, 2));
        return null;
        
      }

}



export const GetItem = async (tabname, keyname, keyvalue) => {
  
  const params = {
      TableName: tabname,
      Key: {
          [keyname]: marshall(keyvalue)
      }
  };

  try {
      const data = await dynamoDBClient.send(new GetItemCommand(params));

      if (!data.Item) {
          console.log('Item not found');
          return null;
      }

      const unmarshalledItem = unmarshall(data.Item);
      return unmarshalledItem;

  } catch (error) {

      console.error('Error getting item:', JSON.stringify(error, null, 2));
      return null

  }
}




export const UpdateItem = async (tabname, keyname, keyvalue, attributeNames, attributeValues) => {

  if (attributeNames.length !== attributeValues.length) {
    throw new Error('Attribute names and values arrays must have the same length');
  }

  const updateExpression = `SET ${attributeNames.map((attr, index) => `#${attr} = :val${index}`).join(', ')}`;

  const expressionAttributeNames = attributeNames.reduce((acc, attr, index) => {
    acc[`#${attr}`] = attr;
    return acc;
  }, {});

  const expressionAttributeValues = attributeValues.reduce((acc, val, index) => {
    acc[`:val${index}`] = Array.isArray(val) ? { L: val.map(item => {return {M: marshall(item)}}) } : marshall(val);
    return acc;
  }, {});

  const params = {
    TableName: tabname,
    Key: {
      [keyname]: marshall(keyvalue)
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues
  };

  try {
    await dynamoDBClient.send(new UpdateItemCommand(params));
    console.log('Item updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating item:', JSON.stringify(error, null, 2));
    return null;
  }
}




export const QueryTab = async (tabname, indexName, attributeName, attributeValue)  => {

  const params = {
    TableName: tabname,
    IndexName: indexName,
    KeyConditionExpression: `#attr = :value`,
    ExpressionAttributeNames: {
      '#attr': attributeName
    },
    ExpressionAttributeValues: {
      ':value': marshall(attributeValue)
    }
  };

  try {
    const data = await dynamoDBClient.send(new QueryCommand(params));

    if (!data.Items || data.Items.length === 0) {
      console.log('No items found with the specified condition');
      return [];
    }

    const unmarshalledItems = data.Items.map(item => unmarshall(item));

    return unmarshalledItems;

  } catch (error) {
    console.error('Error querying items:', JSON.stringify(error, null, 2));
    return null;
  }
}

