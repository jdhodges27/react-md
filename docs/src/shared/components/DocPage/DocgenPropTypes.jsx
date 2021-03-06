import React, { PureComponent, PropTypes } from 'react';
import IconButton from 'react-md/lib/Buttons/IconButton';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import { DataTable, TableHeader, TableBody, TableRow, TableColumn } from 'react-md/lib/DataTables';
import Autocomplete from 'react-md/lib/Autocompletes';
import TextField from 'react-md/lib/TextFields';

import { GITHUB_LINK } from 'constants';
import { sort } from 'utils/ListUtils';
import { toPropTypeId } from 'utils/StringUtils';
import Markdown from 'components/Markdown';
import PropTypesRow from './PropTypesRow';
import ComponentMethods from './ComponentMethods';

import docgenMethodsPropTypes from 'constants/docgenMethodsPropTypes';

export default class DocgenPropTypes extends PureComponent {
  constructor(props) {
    super(props);

    const propList = Object.keys(props.props).map(name => ({ name, ...props.props[name] }));

    this.state = {
      propList,
      propFilter: '',
      ascending: true,
      visibleProps: sort(propList, 'name', true),
    };
  }

  static propTypes = {
    mobile: PropTypes.bool.isRequired,
    tablet: PropTypes.bool.isRequired,
    component: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    props: PropTypes.object.isRequired,
    methods: docgenMethodsPropTypes,
  };

  _sort = () => {
    const ascending = !this.state.ascending;
    this.setState({
      ascending,
      visibleProps: sort(this.state.visibleProps, 'name', ascending),
    });
  };

  _filterProperties = (propFilter) => {
    this.setState({
      propFilter,
      visibleProps: Autocomplete.fuzzyFilter(this.state.propList, propFilter, 'name'),
    });
  };

  render() {
    const { ascending, visibleProps, propFilter } = this.state;
    const { component, source, description, mobile, tablet, methods } = this.props;

    const rows = visibleProps.map(props => <PropTypesRow key={props.name} {...props} />);

    let filter;
    if (tablet || !mobile) {
      filter = (
        <TextField
          label="Filter properties"
          value={propFilter}
          onChange={this._filterProperties}
          floatingLabel={false}
        />
      );
    }

    let methodsTable;
    let methodsTitle;
    if (methods.length) {
      methodsTitle = <CardTitle title="Methods" />;
      methodsTable = <ComponentMethods key="methods" methods={methods} />;
    }

    return (
      <Card
        id={`prop-types-${toPropTypeId(component)}`}
        className="component-prop-types"
        raise={false}
        tableCard
      >
        <CardTitle title={component}>
          {filter}
          <IconButton
            href={`${GITHUB_LINK}/blob/master/${source}`}
            iconClassName="fa fa-github"
            tooltipLabel={`Github source for ${component}`}
            tooltipPosition="left"
          />
        </CardTitle>
        <Markdown markdown={description} className="md-card-text" />
        <DataTable plain>
          <TableHeader>
            <TableRow autoAdjust={false}>
              <TableColumn className="adjusted" onClick={this._sort} sorted={ascending}>Prop name</TableColumn>
              <TableColumn className="adjusted">Prop type</TableColumn>
              <TableColumn className="grow">Description</TableColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows}
          </TableBody>
        </DataTable>
        {methodsTitle}
        {methodsTable}
      </Card>
    );
  }
}
