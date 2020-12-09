// import React, { Component } from 'react'
// import { Text, View, ScrollView, FlatList, 
//     Modal, Button, StyleSheet, Alert, PanResponder } from 'react-native'
// import { Card, Icon, Rating, Input } from 'react-native-elements'
// import { CAMPSITES } from '../shared/campsites'
// import { COMMENTS } from '../shared/comments'
// import { connect } from 'react-redux';
// import { baseUrl } from '../shared/baseUrl';
// import { postFavorite } from '../redux/ActionCreators';
// import { postComment } from '../redux/ActionCreators';
// import * as Animatable from 'react-native-animatable'
// const mapStateToProps = state => {
//     return {
//         campsites: state.campsites,
//         comments: state.comments,
//         favorites: state.favorites
//     };
// };
// const mapDispatchToProps = {
//     postFavorite: campsiteId => (postFavorite(campsiteId)),
//     postComment: (campsiteId, rating, author, text) => 
//     (postComment(campsiteId, rating, author, text))
// };
// function RenderComments({comments}) {
//     const renderCommentItem = ({item}) => {
//         return (
//             <View style={{margin: 10}}>
//                 <Text style={{fontSize: 14}}>{item.text}</Text>
//                 <Rating startingValue={item.rating} 
//                 imageSize={10} readonly
//                 style={{alignItems: 'flex-start', paddingVertical: '5%'}} />
//                 <Text style={{fontSize: 12}}>
//                     {`-- ${item.author}, ${item.date}`}
//                 </Text>
//             </View>
//         )
//     };
//     return (
//         <Animatable.View animation='fadeInUp' duration={2000} delay={1000}>
//             <Card title={'Comments'}>
//                 <FlatList data={comments}
//                 renderItem={renderCommentItem}
//                 keyExtractor={item => item.id.toString()} />
//             </Card>
//         </Animatable.View>
//     )
// }
// function RenderCampsite({campsite, favorite, markFavorite, onShowModal}) {
//     const view = React.createRef();
//     const recognizeDrag = ({dx}) => (dx < -200) ? true : false;
//     const panResponder = PanResponder.create({
//         onStartShouldSetPanResponder: () => true,
//         onPanResponderGrant: () => {
//             view.current.rubberBand(1000)
//             .then(endState => console.log(endState.finished ? 'finished' : 'canceled'));
//         },
//         onPanResponderEnd: (e, gestureState) => {
//             console.log('pan responder end', gestureState);
//             if (recognizeDrag(gestureState)) {
//                 Alert.alert(
//                     'Add Favorite',
//                     'Are you sure you wish to add ' + campsite.name + ' to favorites?',
//                     [
//                         {
//                             text: 'Cancel',
//                             style: 'cancel',
//                             onPress: () => console.log('Cancel Pressed')
//                         },
//                         {
//                             text: 'OK',
//                             onPress: () => props.favorite ?
//                                 console.log('Already set as a favorite') : props.markFavorite()
//                         }
//                     ],
//                     { cancelable: false }
//                 );
//             }
//             return true;
//         }
//     });
//     if (campsite) {
//         return (
//             <Animatable.View animation='fadeInDown' duration={2000} delay={1000}
//             {...panResponder.panHandlers} ref={view}>
//                 <Card
//                     featuredTitle={campsite.name}
//                     image={{uri: baseUrl + campsite.image}}
//                 >
//                     <Text style={{margin: 10}}>
//                         {campsite.description}
//                     </Text>
//                     <View style={styles.cardRow}>
//                         <Icon name={favorite ? 'heart' : 'heart-o'}
//                         type={'font-awesome'} color={'#f50'}
//                         raised reverse onPress={() => favorite ?
//                         console.log('Already set as favorite'): markFavorite()} />
//                         <Icon name={'pencil'} type={'font-awesome'}
//                         color={'#5637DD'} raised reverse
//                         onPress={() => onShowModal()} />
//                     </View>
//                 </Card>
//             </Animatable.View>
//         );
//     }
//     return <View />;
// }
// class CampsiteInfo extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             showModal: false,
//             rating: 5,
//             author: '',
//             text: ''
//         };
//     }
//     static navigationOptions = {
//         title: 'Campsite Information'
//     }
//     markFavorite(campsiteId) {
//         this.props.postFavorite(campsiteId);
//     }
//     toggleModal() {
//         this.setState({showModal: !this.state.showModal})
//     }
//     handleComment(campsiteId, rating, author, text) {
//         console.log('Line 102', campsiteId, rating, author, text)
//         // console.log(JSON.stringify(this.state))
//         this.props.postComment(campsiteId, rating, author, text)
//         this.toggleModal();
//     }
//     resetForm() {
//         this.setState({
//             rating: 5,
//             author: '',
//             text: '',
//             showModal: false
//         })
//     }
//     render() {
//         const campsiteId = this.props.navigation.getParam('campsiteId');
//         const campsite = this.props.campsites.campsites.filter(campsite => campsite.id === campsiteId)[0];
//         const comments = this.props.comments.comments.filter(comment => comment.campsiteId === campsiteId);
//         return (
//             <ScrollView>
//                 <RenderCampsite campsite={campsite}
//                     favorite={this.props.favorites.includes(campsiteId)}
//                     markFavorite={() => this.markFavorite(campsiteId)}
//                     onShowModal={() => this.toggleModal()}
//                 />
//                 <RenderComments comments={comments} />
//                 <Modal
//                     animationType={'slide'}
//                     transparent={false}
//                     visible={this.state.showModal}
//                     onRequestClose={() => this.toggleModal()}
//                 >
//                     <View style={styles.modal}>
//                         <Rating showRating
//                         startingValue={this.state.rating}
//                         imageSize={40}
//                         onFinishRating={rating => this.setState({rating: rating})} 
//                         style={{paddingVertical: 10}} />
//                         <Input placeholder={'Author'}
//                         leftIcon={{type: 'font-awesome', name: 'user-o'}}
//                         leftIconContainerStyle={{paddingRight: 10}}
//                         onChangeText={author => this.setState({author: author})}
//                         value={this.state.author}
//                         />
//                         <Input placeholder={'Comment'}
//                         leftIcon={{type: 'font-awesome', name: 'comment-o'}}
//                         leftIconContainerStyle={{paddingRight: 10}}
//                         onChangeText={text => this.setState({text: text})}
//                         value={this.state.text} />
//                         <View>
//                             <Button title={'Submit'} color={'#5637DD'}
//                             onPress={() => {
//                                 this.handleComment(campsiteId, this.state.rating, this.state.author, this.state.text);
//                                 this.resetForm();
//                             }} />
//                         </View>
//                         <View style={{margin: 10}}>
//                             <Button title={'Cancel'} color={'#808080'}
//                             onPress={() => this.toggleModal()} />
//                         </View>
//                     </View>
//                 </Modal>
//             </ScrollView>
//         )
//     }
// }
// const styles = StyleSheet.create({
//     cardRow : {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         flexDirection: 'row',
//         margin: 20
//     },
//     modal: {
//         justifyContent: 'center',
//         margin: 20,
//         marginTop: 100 //for now
//     }
// })
// export default connect(mapStateToProps, mapDispatchToProps)(CampsiteInfo);