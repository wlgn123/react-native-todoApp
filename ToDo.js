import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'
import PropTypes from 'prop-types';

const { width, height } = Dimensions.get("window")

class Todo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isEditing: false,
            toDoValue: props.text,
        }
    }

    static propTypes = {
        text: PropTypes.string.isRequired,
        isCompleted: PropTypes.bool.isRequired,
        deleteToDo: PropTypes.func.isRequired,
        completeToDo: PropTypes.func.isRequired,
        uncompleteToDo: PropTypes.func.isRequired,
        updateToDo: PropTypes.func.isRequired,
        id: PropTypes.string.isRequired
    };

    render() {
        const { isEditing, toDoValue } = this.state;
        const { text, id, deleteToDo, isCompleted } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.column}>
                    <TouchableOpacity onPress={this._toggleComplete}>
                        <View style={[styles.circle, isCompleted ? styles.completedCircle : styles.uncompletedCircle]} />
                    </TouchableOpacity>
                    {isEditing ? 
                        (
                            <TextInput 
                                style={[styles.input, styles.text, isCompleted ? styles.completedText : styles.uncompletedText]} 
                                value={ toDoValue } 
                                onChangeText={this._controlInput}
                                returnKeyType={"done"}
                                onBlur={this._finishEditing}
                                multiline={true} />
                        ) : 
                        (
                            <Text 
                                style={[
                                    styles.text, 
                                    isCompleted ? styles.completedText : styles.uncompletedText
                                ]}
                            > 
                                { text } 
                            </Text>
                        )}
                    
                </View>
                {isEditing ? 
                    <View style={styles.actions}>
                        <TouchableOpacity onPressOut={this._finishEditing} delayPressIn={1} delayPressOut={1}>
                            <View style={styles.actionContainer}>
                                <MaterialIcons size={28} color="green" name="check-circle" />
                            </View>
                        </TouchableOpacity>
                    </View> : 
                    <View style={styles.actions}>
                        <TouchableOpacity onPressOut={this._startEditing} delayPressIn={1} delayPressOut={1}>
                            <View style={styles.actionContainer}>
                                <MaterialIcons size={28} color="green" name="edit" />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPressOut={(event) =>  {event.stopPropagation(); deleteToDo(id);} }>
                            <View style={styles.actionContainer}>
                                <MaterialIcons size={28} color="red" name="cancel" />
                            </View>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        )
    }

    _toggleComplete = (event) => {
        const { isCompleted, completeToDo, uncompleteToDo, id } = this.props;
        if(isCompleted) {
            uncompleteToDo(id)
        } else {
            completeToDo(id) 
        }
    };

    _startEditing = (event) => {
        this.setState({
            isEditing: true,
        })
    };

    _finishEditing = (event) => {
        const { toDoValue } = this.state;
        const { id, updateToDo } = this.props;

        updateToDo(id, toDoValue);

        this.setState({
            isEditing: false,
        });
    };

    _controlInput = (text) => {
        this.setState({
            toDoValue: text
        })
    }
}

const styles = StyleSheet.create({
    container: {
        width: width - 50,
        borderBottomColor: "#bbb",
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    text:{
        fontWeight: "600",
        fontSize: 20,
        marginVertical: 20,
    },
    circle:{
        width: 30,
        height: 30,
        borderRadius: 25,
        borderWidth: 3,
        marginRight: 20
    },
    completedCircle: {
        borderColor: "#bbb",
    },
    uncompletedCircle: {
        borderColor: "#F23657",
    },
    completedText: {
        color: "#bbb",
        textDecorationLine: "line-through"
    },
    uncompletedText: {
        color: "#353839"
    },
    column: {
        flexDirection: "row",
        alignItems: "center",
        width: width / 2,
    },
    actions: {
        flexDirection: "row"
    },
    actionContainer: {
        marginVertical: 10,
        marginHorizontal: 10,
    },
    input: {
        marginVertical: 20,
        width: width / 2
    }
})

export default Todo;