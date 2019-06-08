import React, { Component } from 'react';
import { Row, Col } from 'antd';
import styled from 'styled-components';
import { injectIntl } from 'react-intl';
import _ from 'lodash';

import CustomCard from '../CustomCard';

const Label = styled.small`
  text-transform: uppercase;
`;

const Price = styled.div`
  color: #fff;
  font-size: 3em;
  font-weight: 300;
  line-height: 1;

  &::after {
    content: '¢';
    font-size: 2rem;
  }
`;

const Fee = styled.div`
  color: #fff;
  font-size: 3em;
  font-weight: 300;
  line-height: 1;

  small {
    font-size: 2rem;
  }
`;

const Title = styled.div`
  font-size: 1rem;
  text-transform: uppercase;
  margin-bottom: 16px;
`;

class Prices extends Component {
  static conversion = (num, multiplier) => (num * multiplier).toFixed(3);
  static format = (num, multiplier = true) => multiplier ? num.toFixed(3) : (num / 10).toFixed(3);

  constructor() {
    super();

    this.state = {
      tickers: {},
      balances: {},
    };

    this.getVETPrice = this.getVETPrice.bind(this);
    this.getVTHOPrice = this.getVTHOPrice.bind(this);
  }

  componentDidMount() {
    this.props.onLoad();
  }

  componentWillReceiveProps({ tickers, balances }) {
    if (!_.isEmpty(tickers)) {
      this.setState({ tickers });
    }

    if (!_.isEmpty(balances)) {
      this.setState({ balances });
    }
  }

  getVETPrice() {
    const { balances, tickers } = this.state;
    return (((balances.VTHO / balances.VET) * tickers.vtho) * 100 || 0);
  }

  getVTHOPrice() {
    const { balances, tickers } = this.state;
    return (((balances.VET / balances.vtho) * tickers.VET) * 100 || 0);
  }

  render() {
    const { tickers } = this.state;
    const { intl, token, fees } = this.props;

    return (
      <div>
        <Row gutter={30}>
          <Col sm={24} md={12} lg={12} xl={12}>

            <CustomCard>
              <Row type="flex" justify="space-between" gutter={30}>
                <Col>
                  <Title>Vexchange { intl.formatMessage({ id: 'price' }) }</Title>
                  <Label>VET { intl.formatMessage({ id: 'price' }) }</Label>
                  <Price>
                    { Prices.format(this.getVETPrice()) }
                  </Price>
                </Col>
                <Col>
                  <Title>Exchange { intl.formatMessage({ id: 'price' }) } </Title>
                  <Label>{ token.name } { intl.formatMessage({ id: 'price' }) }</Label>
                  <Price>
                    { Prices.format(this.getVTHOPrice()) }
                  </Price>
                </Col>
              </Row>
            </CustomCard>

          </Col>
          <Col sm={24} md={12} lg={12} xl={12}>

            <CustomCard> 
              <Title>Gas { intl.formatMessage({ id: 'fees.label' }) }</Title>

              <Row type="flex" justify="space-between" gutter={30}>
                <Col>
                  <div>
                    <Label>VET { intl.formatMessage({ id: 'fees.label' }) }</Label>
                  </div>
                  { (token && token.name) &&
                    <Fee>
                      { fees[token.name].vetTradeFee }
                      <small>vet</small>
                    </Fee>
                  }
                </Col>
                <Col>
                  <div>
                    <Label>{ token.name } { intl.formatMessage({ id: 'fees.label' }) }</Label>
                  </div>
                  { (token && token.name) &&
                    <Fee>
                      { fees[token.name].tokenTradeFee }
                      <small>{ token.name }</small>
                    </Fee>
                  }
                </Col>
              </Row>
            </CustomCard>

          </Col>
        </Row>
      </div>
    );
  }
}

export default injectIntl(Prices);
