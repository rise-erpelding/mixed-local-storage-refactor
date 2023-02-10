/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import GroupsMadePage from './GroupsMadePage';
import { BrowserRouter } from 'react-router-dom';
import ls from 'local-storage';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faTrashAlt,
  faEdit,
  faTimes,
  faFlushed,
  faPlus,
  faMinus,
  faWindowClose,
  faArrowLeft,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import {
  faSave as faSaveRegular,
  faEye as faEyeRegular,
} from '@fortawesome/free-regular-svg-icons';

library.add(
  faTrashAlt,
  faEdit,
  faTimes,
  faFlushed,
  faPlus,
  faMinus,
  faSaveRegular,
  faEyeRegular,
  faWindowClose,
  faArrowLeft,
  faArrowRight
);

it('renders without crashing', () => {
  const studentArr = [
    {
      alias: 'Rose',
      Energy: 'Introversion',
      Information: 'Intuition',
      Decisions: 'Thinking',
      Organization: 'Perceiving',
      groupNum: 3,
    },
    {
      alias: 'Ellie',
      Energy: 'Introversion',
      Information: 'Sensing',
      Decisions: 'Feeling',
      Organization: 'Perceiving',
      groupNum: 3,
    },
    {
      alias: 'Kiefer',
      Energy: 'Extroversion',
      Information: 'Sensing',
      Decisions: 'Thinking',
      Organization: 'Perceiving',
      groupNum: 4,
    },
    {
      alias: 'Tomas',
      Energy: 'Introversion',
      Information: 'Intuition',
      Decisions: 'Thinking',
      Organization: 'Perceiving',
      groupNum: 2,
    },
    {
      alias: 'Pollyanna',
      Energy: 'Extroversion',
      Information: 'Intuition',
      Decisions: 'Feeling',
      Organization: 'Judging',
      groupNum: 1,
    },
    {
      alias: 'Roberto',
      Energy: 'Introversion',
      Information: 'Intuition',
      Decisions: 'Thinking',
      Organization: 'Judging',
      groupNum: 1,
    },
    {
      alias: 'Allen',
      Energy: 'Extroversion',
      Information: 'Sensing',
      Decisions: 'Thinking',
      Organization: 'Perceiving',
      groupNum: 2,
    },
    {
      alias: 'George',
      Energy: 'Extroversion',
      Information: 'Intuition',
      Decisions: 'Thinking',
      Organization: 'Judging',
      groupNum: 2,
    },
    {
      alias: 'Carol',
      Energy: 'Extroversion',
      Information: 'Intuition',
      Decisions: 'Feeling',
      Organization: 'Perceiving',
      groupNum: 1,
    },
    {
      alias: 'Henrietta',
      Energy: 'Extroversion',
      Information: 'Sensing',
      Decisions: 'Feeling',
      Organization: 'Judging',
      groupNum: 3,
    },
    {
      alias: 'Marie',
      Energy: 'Introversion',
      Information: 'Sensing',
      Decisions: 'Thinking',
      Organization: 'Judging',
      groupNum: 1,
    },
    {
      alias: 'John',
      Energy: 'Extroversion',
      Information: 'Sensing',
      Decisions: 'Feeling',
      Organization: 'Perceiving',
      groupNum: 2,
    },
    {
      alias: 'Jules',
      Energy: 'Introversion',
      Information: 'Intuition',
      Decisions: 'Thinking',
      Organization: 'Judging',
      groupNum: 4,
    },
    {
      alias: 'Jennifer',
      Energy: 'Extroversion',
      Information: 'Sensing',
      Decisions: 'Thinking',
      Organization: 'Judging',
      groupNum: 4,
    },
    {
      alias: 'Garrett',
      Energy: 'Introversion',
      Information: 'Sensing',
      Decisions: 'Thinking',
      Organization: 'Judging',
      groupNum: 1,
    },
    {
      alias: 'Javier',
      Energy: 'Extroversion',
      Information: 'Intuition',
      Decisions: 'Feeling',
      Organization: 'Perceiving',
      groupNum: 3,
    },
    {
      alias: 'Kayle',
      Energy: 'Introversion',
      Information: 'Sensing',
      Decisions: 'Feeling',
      Organization: 'Judging',
      groupNum: 4,
    },
    {
      alias: 'Dawn',
      Energy: 'Extroversion',
      Information: 'Intuition',
      Decisions: 'Feeling',
      Organization: 'Perceiving',
      groupNum: 4,
    },
    {
      alias: 'Cat',
      Energy: 'Introversion',
      Information: 'Intuition',
      Decisions: 'Thinking',
      Organization: 'Judging',
      groupNum: 2,
    },
    {
      alias: 'Greg',
      Energy: 'Extroversion',
      Information: 'Sensing',
      Decisions: 'Thinking',
      Organization: 'Judging',
      groupNum: 3,
    },
    {
      alias: 'Anneliese',
      Energy: 'Extroversion',
      Information: 'Intuition',
      Decisions: 'Thinking',
      Organization: 'Perceiving',
      groupNum: 4,
    },
    {
      alias: 'Lillian',
      Energy: 'Introversion',
      Information: 'Sensing',
      Decisions: 'Feeling',
      Organization: 'Judging',
      groupNum: 3,
    },
    {
      alias: 'Miles',
      Energy: 'Extroversion',
      Information: 'Sensing',
      Decisions: 'Thinking',
      Organization: 'Perceiving',
      groupNum: 2,
    },
  ];
  const categoryNames = ['Energy', 'Information', 'Decisions', 'Organization'];
  ls.set('studentArr', studentArr);
  ls.set('categoryNames', categoryNames);
  const main = document.createElement('main');
  ReactDOM.render(
    <BrowserRouter>
      <GroupsMadePage />
    </BrowserRouter>,
    main
  );
  ReactDOM.unmountComponentAtNode(main);
});
