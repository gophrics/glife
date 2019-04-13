'use strict';

import * as React from 'react';
import {
    StyleSheet,
    Slider,
    Text,
    View
} from 'react-native';

interface IState {
    sliderWidth: any,
    sliderLeft: any,
    sliderRatio: any,
    adjustSign: any,
    itemWidth: any,
    value: any,
    item: any
}

interface IProps {
    items: any,
    defaultItem: any,
    style: any
}

export default class SnapSlider extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        
        var sliderRatio = 1 / (this.props.items.length - 1);
        var value = sliderRatio * this.props.defaultItem;
        var item = this.props.defaultItem;
        this.state = {
            sliderRatio: sliderRatio,
            value: value,
            item: item,
            adjustSign: 1,
            itemWidth: [],
            sliderWidth: 0,
            sliderLeft: 0,
        }
    }

    _sliderStyle() {
        return [defaultStyles.slider, {width: this.state.sliderWidth, left: this.state.sliderLeft}, this.props.style];
    }

    _onSlidingCompleteCallback(v: any) {
        //pad the value to the snap position
        var halfRatio = this.state.sliderRatio / 2;
        var i = 0;
        for (;;) {
            if ((v < this.state.sliderRatio) || (v <= 0)) {
                if (v >= halfRatio) {
                    i++;
                }
                break;
            }
            v = v - this.state.sliderRatio;
            i++;
        }
        var value = this.state.sliderRatio * i;

        //Move the slider
        value = value + (this.state.adjustSign * 0.000001);//enforce UI update
        if (this.state.adjustSign > 0) {
            this.setState({adjustSign: -1});
        } else {
            this.setState({adjustSign: 1});
        }
        this.setState({value: value, item: i}, () =>{
            //callback
        });

    }

    _getItemWidth(x: any) {
        var width = x.nativeEvent.layout.width;
        var itemWidth = this.state.itemWidth;
        itemWidth.push(width);
        this.setState({itemWidth: itemWidth});
        //we have all itemWidth determined, let's update the silder width
        if (this.state.itemWidth.length == this.props.items.length) {
            var max = Math.max.apply(null, this.state.itemWidth);
            if (this.refs.slider && this.state.sliderWidth > 0) {
                var that = this;
                var w = 0, l;
                var buffer = 30;//add buffer for the slider 'ball' control
                if(buffer > w){
                    buffer = 0;
                }
                w = that.state.sliderWidth - max;
                w = w + buffer;
                l = max / 2;
                l = l - buffer / 2;
                that.setState({sliderWidth: w});
                that.setState({sliderLeft: l});
            }
        }
    }

    _getSliderWidth(e: any) {
        var {x, y, width, height} = e.nativeEvent.layout;
        this.setState({sliderWidth: width});
    }

    _labelView() {
        var itemStyle = [defaultStyles.item];
        let labels = this.props.items.map((i: any, j: any) => <Text key={i.value} ref={"t"+j} style={itemStyle} onLayout={this._getItemWidth}>{i.label}</Text>);
        return (
            <View style={[defaultStyles.itemWrapper]}>
            { labels }
            </View>
        );
    }

    render() {
        return (
            <View onLayout={this._getSliderWidth.bind(this)} style={[defaultStyles.container]}>
                <Slider ref="slider" {...this.props} style={this._sliderStyle()} onSlidingComplete={(value) => this._onSlidingCompleteCallback(value)} value={this.state.value} />
            </View>
        );
    }
}


var defaultStyles = StyleSheet.create({
    container: {
        alignSelf: 'stretch',
    },
    slider: {
    },
    itemWrapper: {
        justifyContent: 'space-between',
        alignSelf: 'stretch',
        flexDirection: 'row',
    },
    item: {
    },
});