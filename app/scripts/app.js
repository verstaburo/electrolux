// begin pollyfils for choices work in IE11
import 'polyfill-array-includes';
import 'array-from-polyfill';
import 'custom-event-polyfill';
import objectassign from 'es6-object-assign';
import find from 'array.prototype.find';
// end pollyfils for choices work in IE11
import picturefill from 'picturefill';
import svg4everybody from 'svg4everybody';
import objectFitImages from 'object-fit-images';
import './modernizr';
import './globalOptions';
import anchor from '../blocks/js-functions/anchor';
import scrollAnimation from '../blocks/js-functions/scroll-animation';
import {
  selects,
  sliders,
  datepicker,
  inputmask,
  numberinput,
} from '../blocks/form/form';
import popups from '../blocks/popups/popups';
import scrollbar from '../blocks/scrollbar/scrollbar';
import {
  slider,
} from '../blocks/slider/slider';
import tooltips from '../blocks/tooltip/tooltip';
import tabs from '../blocks/tabs/tabs';
import maps from '../blocks/map/map';
import accordion from '../blocks/accordion/accordion';
import '../blocks/rating/rating';
import '../blocks/dropdown/dropdown';
import putBlockIntoSlot from '../blocks/js-functions/put-block-into-slot';
import totop from '../blocks/totop/totop';
import spoiler from '../blocks/spoiler/spoiler';
import sideFeedback from '../components/side-feedback/side-feedback';
import feedbackForm from '../components/feedback-form/feedback-form';

const $ = window.$;

$(() => {
  if (!window.Modernizr.picture) {
    picturefill();
  }
  objectassign.polyfill();
  find.shim();
  svg4everybody();
  objectFitImages();
  anchor();
  selects();
  sliders();
  popups();
  scrollbar();
  slider();
  tooltips();
  tabs();
  datepicker();
  inputmask();
  numberinput();
  maps();
  scrollAnimation();
  accordion();
  putBlockIntoSlot();
  totop();
  spoiler();
  sideFeedback();
  feedbackForm();
});
