import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import { StepModal } from '../Modals/StepModal';
import Icon from 'react-native-vector-icons/AntDesign'

interface IProps {
    title: string
    step: StepModal
    onPress: any
}

interface IState {
    
}

export class CustomButton extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
    }

    onPress = (e: any) => {
        console.log(this.props.step.id)
        this.props.onPress(this.props.step);
    }

    render() {
        return (
            <TouchableOpacity style={{alignSelf: 'center'}} onPress={this.onPress} >
                <Icon size={20} name='pluscircleo' />
            </TouchableOpacity>
        )
    }
}