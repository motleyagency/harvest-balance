import React, { PropTypes } from "react"
import { Form, Label, Input, Button } from "reactstrap"

class BalanceReportForm extends React.Component {
  constructor(props) {
    super(props)
    this.setStartDate = this.setStartDate.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      startDate: null,
    }
  }

  setStartDate(e) {
    this.setState({
      startDate: e.target.value,
    })
  }

  handleSubmit() {
    this.props.onSubmit(this.state.startDate)
  }

  render() {
    return (
      <Form>
        <Label>Start date</Label>
        <Input type="text" name="startDate" onChange={this.setStartDate} />

        <Button onClick={this.handleSubmit}>Get report</Button>
      </Form>
    )
  }
}

BalanceReportForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

export default BalanceReportForm
