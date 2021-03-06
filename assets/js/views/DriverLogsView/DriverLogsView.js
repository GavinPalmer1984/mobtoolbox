import {
    MobService
} from '../../services/MobService/MobService.js';

export const DriverLogsView = Backbone.View.extend({
    el: '#main',
    data: [],
    template: 'views/DriverLogsView/DriverLogsView.html',
    templateCache: null,

    render() {
        if (this.templateCache) {
            this.doRender();
            return this;
        }

        MobService.getTemplate(this.template).then((html) => {
            this.templateCache = _.template(html);
            this.doRender();
        });
        return this;
    },

    doRender() {
        $(this.el).html(this.templateCache);
        this.initData();
        this.renderKeys();
    },

    initData() {
        this.data = JSON.parse(localStorage.getItem('logs_backups'));
        if (!this.data || !this.data.length) {
            this.data = [];
        }
    },

    renderKeys() {
        const $list = $('.historical-logs', this.$el);
        $list.empty();

        this.data.forEach((historical) => {
            const $row = $(`<button type="button" class="list-group-item list-group-item-action">${historical.key}</button>`);
            $row.click(() => {
                if (this.previouslySelected) {
                    this.previouslySelected.removeClass('active');
                }
                $row.addClass('active');
                this.previouslySelected = $row;
                this.renderGrid(historical.logs);
            });
            $list.prepend($row);
        });
    },

    renderGrid(records) {
        const $table = $('.selected-log', this.$el);
        $table.empty();

        const $head = $('<thead></thead>');
        const $header = $('<tr></tr>');
        $header.append('<th scope="col">Member</th>');
        $header.append('<th scope="col">Start</th>');
        $header.append('<th scope="col">Stop</th>');
        $header.append('<th scope="col">Duration</th>');
        $head.append($header);
        $table.append($head);

        const $body = $('<tbody></tbody>');
        $table.append($body);

        records.forEach((myLog) => {
            let $row = $('<tr></tr>');
            $row.append(`<th scope="row">${myLog.mobMember}</th>`);
            $row.append(`<td>${myLog.startTime}</td>`);
            $row.append(`<td>${myLog.stopTime}</td>`);
            $row.append(`<td>${MobService.formatSeconds((new Date(myLog.stopTime) - new Date(myLog.startTime))/1000)}</td>`);
            $body.prepend($row);
        });

        let current = 0;
        records.forEach((myLog) => {
            console.log('gp2', myLog);
            current += ((new Date(myLog.stopTime)) - (new Date(myLog.startTime))) / 1000;
        });
        current = parseInt(current, 10);
        console.log('gp1', current);
        $('#total-seconds').text('total seconds: ' + parseInt(current, 10));
        $('#total-seconds-formatted').text(MobService.formatSeconds(current));
    }
});
