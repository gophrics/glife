import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import { StepModal } from '../Modals/StepModal';
import Icon from 'react-native-vector-icons/AntDesign'

interface IProps {
    title: string
    step: StepModal
    onPress: any
    onLayout?: any
}

interface IState {
    
}

export class CustomButton extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
    }

    onPress = (e: any) => {
        this.props.onPress(this.props.step);
    }

    render() {
        return (
            <TouchableOpacity onLayout={this.props.onLayout} style={{alignSelf: 'center'}} onPress={this.onPress} >
                <Icon size={20} name='pluscircleo' />
            </TouchableOpacity>
        )
    }
}