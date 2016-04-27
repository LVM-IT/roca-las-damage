const backend = require('../backend')

const enrichPreallocation = (preallocation) => {
  return {
    contractId: preallocation.vsnr,
    address: {
      street: preallocation.anschrift.strasse,
      postal: preallocation.anschrift.plz,
      city: preallocation.anschrift.ort,
      district: preallocation.anschrift.stadtteil
    }
  }
}

exports.index = (req, res) => {
  // This is for testing, because the contract IDs are changing
  Promise.all([
    backend.contracts('4711')
  ]).then((result) => {
    res.render('index', {
      contracts: result[0]
    })
  }, (err) => {
    // TODO: Add an error page template
    res.send(`An error occurred: ${err}`)
  })
}

exports.new = (req, res) => {
  const branch = req.query.branch
  const partnerId = req.query.partnerId
  const contractId = req.query.contractId

  Promise.all([
    backend.preallocation(branch, partnerId, contractId)
  ]).then((result) => {
    res.render('show', {
      branch: branch,
      partnerId: partnerId,
      preallocation: enrichPreallocation(result[0])
    })
  }, (err) => {
    // TODO: Add an error page template
    res.send(`An error occurred: ${err}`)
  })
}

exports.create = (req, res) => {
  const partnerId = req.body['partner-id']
  const contractId = req.body['contract-id']

  Promise.all([
    backend.report(JSON.stringify(req.body))
  ]).then(() => {
    res.redirect(303, `${req.app.locals.roca_url}/partners/${partnerId}/contracts/${contractId}?success=true`)
  }, (err) => {
    // TODO: Add an error page template
    res.send(`An error occurred: ${err}`)
  })
}
