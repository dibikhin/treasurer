const should = require('should')
const HttpStatus = require('http-status-codes')
const request = require('supertest')('http://localhost:8080')

context('Get Docs', function () {
    it('responds with 200 and HTML page', function (done) {
        request
            .get('/docs/')
            .set('Accept', 'text/html')
            .expect(HttpStatus.OK)
            .expect('Content-Type', 'text/html; charset=UTF-8')
            .end(function (err, res) {
                if (err) {
                    console.log(res.error)
                    return done(err)
                }

                should.exist(res.text)
                res.text.length.should.be.above(0)

                done()
            })
    })
})

describe('Treasurer. Integration tests', function () {
    describe('GET unknown route', function () {
        it('responds with 501 & error response', function (done) {
            request
                .get('/v0/treaSureRRer/bla-Bla-bla/qwerty12345')
                .set('Accept', 'application/json')
                .expect(HttpStatus.NOT_IMPLEMENTED)
                .end(function (err, res) {
                    if (err) {
                        console.log(res.error)
                        return done(err)
                    }

                    const error_response = res.body
                    should.exist(error_response.code)
                    should.exist(error_response.title)
                    should.exist(error_response.detail)

                    done()
                })
        })
    })

    context('Get Balance of Account:', function () {
        describe('GET balance of existing account', function () {
            it('responds with 200 & brief account', function (done) {
                request
                    .get('/v0/treasurer/balance/5ae727e310184a24eabab171')
                    .set('Accept', 'application/json')
                    .expect(HttpStatus.OK)
                    .end(function (err, res) {
                        if (err) return done(err)

                        should.exist(res.body)

                        const account_brief = res.body.account_brief

                        should.exist(account_brief)
                        should.exist(account_brief.id)
                        should.exist(account_brief.balance)
                        should.exist(account_brief.currency)

                        done()
                    })
            })
        })

        describe('GET balance with NOT valid account_id', function () {
            it('responds with 400 & error response', function (done) {
                request
                    .get('/v0/treasurer/balance/qwerty12345')
                    .set('Accept', 'application/json')
                    .expect(HttpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        if (err) return done(err)

                        const error_response = res.body
                        should.exist(error_response.code)
                        should.exist(error_response.title)
                        should.exist(error_response.detail)

                        done()
                    })
            })
        })

        describe('GET balance of NOT existing account', function () {
            it('responds with 404 & error response', function (done) {
                request
                    .get('/v0/treasurer/balance/5ae727e310184a24eabab170')
                    .set('Accept', 'application/json')
                    .expect(HttpStatus.NOT_FOUND)
                    .end(function (err, res) {
                        if (err) return done(err)

                        const error_response = res.body
                        should.exist(error_response)
                        should.exist(error_response.code)
                        should.exist(error_response.title)
                        should.exist(error_response.detail)

                        done()
                    })
            })
        })
    })

    context('Deposit into Account:', function () {
        describe('Deposit into existing account', function () {
            it('responds with 200 & brief account', function (done) {
                request
                    .post('/v0/treasurer/deposit')
                    .send({
                        account_id: '5ae727e310184a24eabab171',
                        incoming: 1.225
                    })
                    .set('Accept', 'application/json')
                    .expect(HttpStatus.OK)
                    .end(function (err, res) {
                        if (err) return done(err)

                        should.exist(res.body)

                        const account_brief = res.body.account_brief

                        should.exist(account_brief)
                        should.exist(account_brief.id)
                        should.exist(account_brief.balance)
                        should.exist(account_brief.currency)

                        done()
                    })
            })
        })

        describe('Deposit into NOT valid account_id', function () {
            it('responds with 400 & error response', function (done) {
                request
                    .post('/v0/treasurer/deposit')
                    .send({
                        account_id: 'qwerty12345',
                        incoming: 1.225
                    })
                    .set('Accept', 'application/json')
                    .expect(HttpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        if (err) return done(err)

                        const error_response = res.body
                        should.exist(error_response.code)
                        should.exist(error_response.title)
                        should.exist(error_response.detail)

                        done()
                    })
            })
        })

        describe('Deposit into NOT existing account', function () {
            it('responds with 404 & error response', function (done) {
                request
                    .post('/v0/treasurer/deposit')
                    .send({
                        account_id: '5ae727e310184a24eabab170',
                        incoming: 1.225
                    })
                    .set('Accept', 'application/json')
                    .expect(HttpStatus.NOT_FOUND)
                    .end(function (err, res) {
                        if (err) return done(err)

                        const error_response = res.body
                        should.exist(error_response)
                        should.exist(error_response.code)
                        should.exist(error_response.title)
                        should.exist(error_response.detail)

                        done()
                    })
            })
        })
    })

    context('Withdraw from Account:', function () {
        describe('Withdraw from existing account', function () {
            it('responds with 200 & brief account', function (done) {
                request
                    .post('/v0/treasurer/withdraw')
                    .send({
                        account_id: '5ae727e310184a24eabab171',
                        outgoing: 1.425
                    })
                    .set('Accept', 'application/json')
                    .expect(HttpStatus.OK)
                    .end(function (err, res) {
                        if (err) return done(err)

                        should.exist(res.body)

                        const account_brief = res.body.account_brief

                        should.exist(account_brief)
                        should.exist(account_brief.id)
                        should.exist(account_brief.balance)
                        should.exist(account_brief.currency)

                        done()
                    })
            })

            context('Withdraw excessive amount', function () {
                specify('responds with 422 & error response', function (done) {
                    request
                        .post('/v0/treasurer/withdraw')
                        .send({
                            account_id: '5ae727e310184a24eabab171',
                            outgoing: 1000 * 1000 * 1000 * 1000
                        })
                        .set('Accept', 'application/json')
                        .expect(HttpStatus.UNPROCESSABLE_ENTITY)
                        .end(function (err, res) {
                            if (err) return done(err)

                            const error_response = res.body
                            should.exist(error_response.code)
                            should.exist(error_response.title)
                            should.exist(error_response.detail)

                            done()
                        })
                })
            })
        })

        describe('Withdraw from NOT valid account_id', function () {
            it('responds with 400 & error response', function (done) {
                request
                    .post('/v0/treasurer/withdraw')
                    .send({
                        account_id: 'qwerty12345',
                        incoming: 1.425
                    })
                    .set('Accept', 'application/json')
                    .expect(HttpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        if (err) return done(err)

                        const error_response = res.body
                        should.exist(error_response.code)
                        should.exist(error_response.title)
                        should.exist(error_response.detail)

                        done()
                    })
            })
        })

        describe('Withdraw from NOT existing account', function () {
            it('responds with 404 & error response', function (done) {
                request
                    .post('/v0/treasurer/withdraw')
                    .send({
                        account_id: '5ae727e310184a24eabab170',
                        incoming: 1.425
                    })
                    .set('Accept', 'application/json')
                    .expect(HttpStatus.NOT_FOUND)
                    .end(function (err, res) {
                        if (err) return done(err)

                        const error_response = res.body
                        should.exist(error_response)
                        should.exist(error_response.code)
                        should.exist(error_response.title)
                        should.exist(error_response.detail)

                        done()
                    })
            })
        })
    })

    // TODO Transfer funds
})

// TODO handle:
// - 405 METHOD NOT ALLOWED httpstatuses.com/405

// - deleted (archived)
// - suspended
// - self transfer
// - higher|lower op limit

// - negative or zero amount
// - not decimal

// - rate in transfer
// - hold? permanent|temporary

// TODO regenerate swagger yaml
