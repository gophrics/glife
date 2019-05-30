import * as React from 'react';
import { Button } from 'react-native';
import { StepModal } from '../Modals/StepModal';


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
            <Button  title={this.props.title} onPress={this.onPress} />
        )
    }
}