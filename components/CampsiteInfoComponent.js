import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Button } from 'react-native';
import { Card, Icon, Rating, Input} from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite } from '../redux/ActionCreators';
import { postComment } from '../redux/ActionCreators';


const mapStateToProps = state => {
    return {
        campsites: state.campsites,
        comments: state.comments,
        favorites: state.favorites    
    };
};

const mapDispatchToProps = {
    postFavorite: campsiteId => postFavorite(campsiteId),
    postComment: (campsiteId, rating, author, text) => postComment(campsiteId, rating, author, text)
};

function RenderCampsite(props) {
    const {campsite} = props
    if (campsite) {
        return (
            <Card
                featuredTitle={campsite.name}
                image={{uri: baseUrl + campsite.image}}>
            
                <Text style={{margin: 10}}>
                    {campsite.description}
                </Text>
                <View style={styles.cardRow}>
                    <Icon
                        name={props.favorite ? 'heart':'heart-o'}
                        type='font-awesome'
                        color='#f50'
                        raised
                        reverse
                        onPress={()=> props.markFavorite()}
                    />
                    <Icon
                        name={'pencil'}
                        type='font-awesome'
                        color='#5637dd'
                        raised
                        reverse
                        onPress={()=> props.onShowModal()}
                    />
                </View>
            </Card>
        );
    }
    return <View />;
}

function RenderComments({comments}) {
    const renderCommentItem = ({item})=>{
        return(
            <View style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.text}</Text>
                <Rating
                            type='star'
                            startingValue = {5}
                            ratingCount={5}
                            imageSize={10}
                            showRating={false}
                            //onFinishRating={rating => this.setState({rating: rating})}
                            style={{alignItems: 'flex-start', paddingVertical: '5%'}}
                            />
                <Text style={{fontSize: 12}}>`-- ${item.author}, {item.date}`</Text>
            </View>
        )
    }
    return(
        <Card
            featuredTitle="Comments"
        >
            <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
            >
            </FlatList>

        </Card>
    )
}

class CampsiteInfo extends Component {
    
    constructor(props){
        super(props);
        this.state= {
            showModal: false,
            rating: 5,
            author:'',
            text:''
        }
    }

    markFavorite(campsiteId){
        this.props.postFavorite(campsiteId);
    }
    toggleModal(){
        this.setState({showModal: !this.state.showModal})
    }
    handleComment(campsiteId){
        console.log(this.state.rating, this.state.comment, this.state.text)
        this.props.postComment(campsiteId, this.state.rating, this.state.author, this.state.text)
    }
    resetForm(){
        this.setState({
            rating: 5,
            author:'',
            text:''
        })
    }
    static navigationOptions = {
        title: 'Campsite Information'
    }

    render() {
        const campsiteId = this.props.navigation.getParam('campsiteId');
        const campsite = this.props.campsites.campsites.find(campsite => campsite.id === campsiteId);
        const comments = this.props.comments.comments.filter(comment => comment.campsiteId === campsiteId);
        return(
            <ScrollView>
                <RenderCampsite
                    onShowModal= {()=> this.toggleModal()}
                    campsite={campsite} 
                    favorite={this.props.favorites.includes(campsiteId)}
                    markFavorite={() => this.markFavorite(campsiteId)}
                />
                <RenderComments comments={comments} />
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={() => this.toggleModal()}
                >
                    <View style={styles.modal}>
                        <Rating
                            type='star'
                            startingValue = {this.state.rating}
                            ratingCount={5}
                            imageSize={40}
                            showRating
                            onFinishRating={rating => this.setState({rating: rating})}
                            style={{paddingVertical: 10}}
                            />
                        <Input
                            placeholder='Author'
                            leftIcon={
                                <Icon
                                type='font-awesome'
                                name='user-o'
                                size={24}
                                color='black'
                                />
                            }
                            leftIconContainerStyle={{paddingRight:10}}
                            onChangeText={author => this.setState({author:author})}
                            value = {this.state.author}
                            />
                        <Input
                            placeholder='Comment'
                            leftIcon={
                                <Icon
                                type='font-awesome'
                                name='comment-o'
                                size={24}
                                color='black'
                                />
                            }
                            leftIconContainerStyle={{paddingRight:10}}
                            onChangeText={comment=> this.setState({text:comment})}
                            value = {this.state.text}
                            />
                        <View style={{margin: 10}}>
                            <Button
                                onPress={() => {
                                    this.handleComment(campsiteId);
                                    this.resetForm();
                                }}
                                color="#808080"
                                title="Cancel"
                            />
                        </View>
                        <View style={{margin: 10}}>
                            <Button
                                onPress={() => {
                                    this.toggleModal();
                                    this.resetForm()
                                }}
                                color="#5637DD"
                                title="Submit"
                            />
                        </View>
                    </View>
                </Modal> 
            </ScrollView>
        ) 
    }
}

const styles = StyleSheet.create({ 
    cardRow: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      flexDirection: "row",
      margin: 20,
    },
    modal: {
      justifyContent: "center",
      margin: 20,
    }
  });

export default connect(mapStateToProps,mapDispatchToProps)(CampsiteInfo);


