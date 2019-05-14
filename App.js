import React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Dimensions, Platform, ScrollView, AsyncStorage } from 'react-native';
import { AppLoading} from 'expo'
import uuidv1 from 'uuid/v1'
import ToDo from './ToDo'

const { height, width } = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newTodo: "",
    loadedToDos: false,
    toDos: {}
  }

  componentDidMount = () => {
    this._loadedToDos();
  }

  render() {
    const { newTodo, loadedToDos, toDos } = this.state;

    if(!loadedToDos) {
      return <AppLoading />;
    }

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" hidden={true} />
        <Text style={styles.title}>TO-DO APP</Text>
        <View style={styles.card}>
          <TextInput 
            style={styles.input} 
            placeholder="New To Do" 
            value={newTodo} 
            onChangeText={this._controlNewTodo} 
            placeholderTextColor={"#999"}
            returnKeyType={"done"}
            autoCorrect={false}
            onSubmitEditing={this._addToDo}
          />
          <ScrollView contentContainerStyle={styles.toDos} >
            {Object.values(toDos)
              .sort((a, b) =>{
                return a.createAt < b.createAt ? 1 : -1
              })
              .map(toDo => 
                <ToDo 
                  key={toDo.id}
                  uncompleteToDo={this._uncompleteToDo}
                  completeToDo={this._completeToDo}
                  deleteToDo={this._deleteToDo} 
                  updateToDo={this._updateToDo}
                  {...toDo} 
                />)}
          </ScrollView>
        </View>
      </View>
    );
  }

  _controlNewTodo = text => {
    this.setState({
      newTodo: text
    })
  };

  _loadedToDos = async () => {
    try{
      const toDos = await AsyncStorage.getItem("toDos");
      const parsedToDos = JSON.parse(toDos);

      this.setState({ loadedToDos: true, toDos: parsedToDos });
    } catch(err) {
      console.log(err);
    }
  };

  _addToDo = () => {
    const { newTodo } = this.state;
    if(newTodo !== "") {
      this.setState(prevState => {
        const ID = uuidv1();
  
        const newToDoObject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newTodo,
            createAt: Date.now() 
          }
        }

        const newState = {
          ...prevState,
          newTodo: "",
          toDos: {
            ...prevState.toDos,
            ...newToDoObject
          }
        }
        this._saveToDos(newState.toDos);

        return {...newState};
      });
    }
  }

  _deleteToDo = (id) => {
    this.setState( prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];

      const newState = {
        ...prevState,
        ...toDos
      };
      this._saveToDos(newState.toDos);

      return {...newState};
    })
  }

  _uncompleteToDo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: false
          }
        }
      }
      this._saveToDos(newState.toDos);

      return {...newState}
    });
  }

  _completeToDo = (id) => {
    this.setState(prevState =>{
      const newState = {
        ...prevState,
        toDos:{
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: true
          }
        }
      };

      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  }

  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: { 
            ...prevState.toDos[id], 
            text: text
          }
        }
      };

      this._saveToDos(newState.toDos);

      return { ...newState }
    });
  }

  _saveToDos = (newToDos) => {
    const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(newToDos));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F23657',
    alignItems: 'center',
  },
  title:{
    color: "white",
    fontSize: 30,
    marginTop: 40,
    marginBottom: 30,
    fontWeight: "400"
  },
  card:{
    backgroundColor: "white",
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor:"rgba(50, 50, 50)",
        shadowOpacity: 0.5,
        shadowRadius: 10,
        shadowOffset:{
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 4,
      }
    })
  },
  input:{
    padding: 20,
    borderColor: "transparent",
    borderBottomColor: "#bbb",
    borderWidth: 1,
    fontSize: 15,
  },
  toDos: {
    alignItems: "center"
  }
});
