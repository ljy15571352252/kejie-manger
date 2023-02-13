<template>
    <Card title="页面设置" icon="ios-options" shadow >
        <!-- <Form :model="formOptions" :label-width="80">
            <FormItem label="Input">
                <Input v-model="formOptions.input" placeholder="Enter something..."></Input>
            </FormItem>
            <FormItem label="Select">
                <Select v-model="formOptions.select">
                    <Option value="beijing">New York</Option>
                    <Option value="shanghai">London</Option>
                    <Option value="shenzhen">Sydney</Option>
                </Select>
            </FormItem>
            <FormItem label="DatePicker">
                <Row>
                    <Col span="11">
                        <DatePicker type="date" placeholder="Select date" v-model="formOptions.date"></DatePicker>
                    </Col>
                    <Col span="2" style="text-align: center">-</Col>
                    <Col span="11">
                        <TimePicker type="time" placeholder="Select time" v-model="formOptions.time"></TimePicker>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="Radio" v-show="formOptions.radio">
                <RadioGroup v-model="formOptions.radio">
                    <Radio label="male">Male</Radio>
                    <Radio label="female">Female</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="Checkbox">
                <CheckboxGroup v-model="formOptions.checkbox">
                    <Checkbox label="Eat"></Checkbox>
                    <Checkbox label="Sleep"></Checkbox>
                    <Checkbox label="Run"></Checkbox>
                    <Checkbox label="Movie"></Checkbox>
                </CheckboxGroup>
            </FormItem>
            <FormItem label="Switch">
                <i-switch v-model="formOptions.switch" size="large">
                    <span slot="open">On</span>
                    <span slot="close">Off</span>
                </i-switch>
            </FormItem>
            <FormItem label="Slider">
                <Slider v-model="formOptions.slider" range></Slider>
            </FormItem>
            <FormItem label="Text">
                <Input v-model="formOptions.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
            </FormItem>
            <FormItem>
                <Button type="primary">Submit</Button>
                <Button style="margin-left: 8px">Cancel</Button>
            </FormItem>
        </Form> -->
    </Card>
</template>

<script>
export default {
    props:['formOptions'],
    data(){
        return{
        }
    }
}
</script>

<style>

</style>