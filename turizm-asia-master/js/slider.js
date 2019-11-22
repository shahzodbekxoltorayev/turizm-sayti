class CitiesSlider extends React.Component {
  constructor(props) {
    super(props);

    this.IMAGE_PARTS = 4;

    this.changeTO = null;
    this.AUTOCHANGE_TIME = 4000;

    this.state = { activeSlide: -1, prevSlide: -1, sliderReady: false };
  }

  componentWillUnmount() {
    window.clearTimeout(this.changeTO);
  }

  componentDidMount() {
    this.runAutochangeTO();
    setTimeout(() => {
      this.setState({ activeSlide: 0, sliderReady: true });
    }, 0);
  }

  runAutochangeTO() {
    this.changeTO = setTimeout(() => {
      this.changeSlidesr(1);
      this.runAutochangeTO();
    }, this.AUTOCHANGE_TIME);
  }

  changeSlidesr(change) {
    window.clearTimeout(this.changeTO);
    const { length } = this.props.slidesr;
    const prevSlide = this.state.activeSlide;
    let activeSlide = prevSlide + change;
    if (activeSlide < 0) activeSlide = length - 1;
    if (activeSlide >= length) activeSlide = 0;
    this.setState({ activeSlide, prevSlide });
  }

  render() {
    const { activeSlide, prevSlide, sliderReady } = this.state;
    return (
      React.createElement("div", { className: classNames('slider', { 's--ready': sliderReady }) },
      React.createElement("p", { className: "slider__top-heading" }, " "),
      React.createElement("div", { className: "slider__slides" },
      this.props.slidesr.map((slide, index) =>
      React.createElement("div", {
        className: classNames('slider__slide', { 's--active': activeSlide === index, 's--prev': prevSlide === index }),
        key: slide.city },

      React.createElement("div", { className: "slider__slide-content" },
      React.createElement("h3", { className: "slider__slide-subheading" }, slide.country || slide.city),
      React.createElement("h2", { className: "slider__slide-heading" },
      slide.city.split('').map(l => React.createElement("span", null, l))),

      React.createElement("p", { className: "slider__slide-readmore" }, " ")),

      React.createElement("div", { className: "slider__slide-parts" },
      [...Array(this.IMAGE_PARTS).fill()].map((x, i) =>
      React.createElement("div", { className: "slider__slide-part", key: i },
      React.createElement("div", { className: "slider__slide-part-inner", style: { backgroundImage: `url(${slide.img})` } }))))))),






      // React.createElement("div", { className: "slider__control", onClick: () => this.changeSlidesr(-1) }),
      // React.createElement("div", { className: "slider__control slider__control--right", onClick: () => this.changeSlidesr(1) })
      ));


  }}


const slidesr = [
{
  city: '        ',
  country: ' ',
  img: 'images/uzb/1.jpg' },
{
  city: '         ',
    country: ' ',
  img: ' images/Krg/kyr2.jpg' },

{
  city: '       ',
  country: ' ',
  img: 'images/kaz/5.jpg' },

{
  city: '             ',
  country: ' ',
  img: 'images/uzb.jpg' }];



ReactDOM.render(React.createElement(CitiesSlider, { slidesr: slidesr }), document.querySelector('#appp'));