const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean
} = require('graphql');

// Card Type
const CardType = new GraphQLObjectType({
    name: 'Card',
    fields: () => ({
        CardId: {type:GraphQLString},
        Name: {type:GraphQLString},
        Language: {type:GraphQLInt}
    })
})

// CardData Type
const CardDataType = new GraphQLObjectType({
    name: 'CardData',
    fields: () => ({
        OperationResult: {type:GraphQLString}
    })
})

// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        search: {
            type: new GraphQLList(CardType),
            resolve(parentValue, args) {
                return axios.post('https://api.hunterer.wizards.com/Business/CardSearch/Web/Search',
                    {
                        "FirstResult":1,
                        "MaxResults":499,
                        "SearchTerms":[
                             {
                                   "Id":15,"Value":"serra"
                             }],
                        "UseAndForColor":true,
                        "UseExactColor":true
                  }
                )
                .then(res => res.data.CardData);
            }
        },
        random: {
            type: new GraphQLList(CardType),
            resolve(parentValue, args) {
                return axios.post('https://api.hunterer.wizards.com/Business/CardSearch/Web/GetRandomCard',
                    {
                        "FirstResult":1,
                        "MaxResults":499,
                        "SearchTerms":[
                             {
                                   "Id":15,"Value":"serra"
                             }],
                        "UseAndForColor":true,
                        "UseExactColor":true
                  }
                )
                .then(res => res.data.CardData);
            }
        },
        cardinfo: {
            type: new GraphQLNonNull(CardDataType),
            args: {
                CardID:{type: new GraphQLNonNull(GraphQLString)},
                // IncludeOracle:{type:GraphQLBoolean},
                // IncludePrinting:{type:GraphQLBoolean},
                // IncludeRulings:{type:GraphQLBoolean},
                // IncludeLegality:{type:GraphQLBoolean},
            },
            // CardID: "009e4cdc-4674-4551-abee-18fd343fd97f", IncludeOracle:true, IncludeRulings:true, IncludePrinting:true, IncludeLegality:true
            resolve(parentValue, args) {
               return axios.get('https://api.hunterer.wizards.com/Business/CardSearch/Web/GetCardInfo?CARDID='+args.CardID)
                .then(res => res.data);
            }
        }

    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
});