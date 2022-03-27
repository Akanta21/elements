import React from 'react';
import { within, userEvent } from '@storybook/testing-library';

import {Cards} from '../components/Cards'

export default {
    title: 'Example/Card',
    component: Cards,
    parameters:{
        layout: 'fullscreen'
    }
}

const Template = (args) => <Cards {...args} />;

export const Card = Template.bind({})
Card.args = {
    apiKey: process.env.API_KEY,
    amount: '10000',
    currency: 'IDR'
}

export const Card2 = Template.bind({})