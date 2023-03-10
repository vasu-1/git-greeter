const issueCreate = async (context, issueGreetMessage) => {
  var author = context.payload.sender.login;
  const params = context.issue({
    body: issueGreetMessage,
  });
  // `Hey **${author}** 🙋🏻‍♂️<br/>Thank you for taking the time to create an issue in our GitHub repository :octocat: Your contribution is greatly appreciated and will help us improve our project. We value your feedback and will review your issue as soon as possible. Please feel free to provide any additional information or context that might help us better understand your issue. 👍🏻`
  // Post a comment on the issue creating
  return await context.octokit.issues.createComment(params);
};

const issueAssign = async (context) => {
  var author = context.payload.sender.login;
  var issueOwner = context.payload.issue.user.login;
  var repo = context.payload.repository.name;
  var issue_number = context.payload.issue.number;
  var owner = context.payload.repository.owner.login;

  var params;
  if (author != issueOwner) {
    params = context.issue({
      body: `Hey **${author}** 🙋🏻‍♂️<br/>Thanks for commenting 😀, but this issue is not for you or not created by you, so **can't be assigned** to you.👍🏻 Reach out to repository owner if you have any queries :octacat:`,
    });
  } else {
    params = context.issue({
      body: `Hey **${author}** 🙋🏻‍♂️<br/>Thanks for commenting 😀, This issue is assigned to you 🎉 **You can start your valuable contribution.** ✨`,
    });
    // assign issue
    await context.octokit.issues.addAssignees({
      owner,
      repo,
      issue_number,
      assignees: [author],
    });
  }
  // create a comment
  return await context.octokit.issues.createComment(params);
};

const issueEdit = async (context) => {
  var repo = context.payload.repository.name;
  var issue_number = context.payload.issue.number;
  var owner = context.payload.repository.owner.login;
  // react on issue when edited
  return await context.octokit.reactions.createForIssue({
    owner,
    repo,
    issue_number,
    content: "eyes",
  });
};

const issueAddLabel = async (context) => {
  var repo = context.payload.repository.name;
  var issue_number = context.payload.issue.number;
  var owner = context.payload.repository.owner.login;
  // add label on issue when edited
  return await context.octokit.issues.addLabels({
    owner,
    repo,
    issue_number,
    labels: ["review_needed"],
  });
};

const issueClose = async (context) => {
  var author = context.payload.sender.login;
  var repo = context.payload.repository.name;
  var issue_number = context.payload.issue.number;
  var owner = context.payload.repository.owner.login;
  var issue_state = context.payload.issue.state_reason;

  var body;

  if (issue_state == "completed") {
    body = `Hey **${author}** 🙋🏻‍♂️<br/>Hureeeeh🎉🥳 Your issue has been closed and **resolved**. 🎉 <br/> **Thanks for contributing** ✨`;
  } else if (issue_state == "not_planned") {
    body = `Hey **${author}** 🙋🏻‍♂️<br/>Thanks for giving time to this repository :octocat: ✨<br/>This issue won't fixed.😶<br/> **See you soon** 🎊`;
  }

  // Post a comment on the opening pull request
  return await context.octokit.issues.createComment({
    owner,
    repo,
    issue_number,
    body,
  });
};

const issueReopened = async (context) => {
  var author = context.payload.sender.login;
  var repo = context.payload.repository.name;
  var issue_number = context.payload.issue.number;
  var owner = context.payload.repository.owner.login;
  var issue_state = context.payload.issue.state_reason;

  var body;

  body = `Hey **${author}** 🙋🏻‍♂️<br/>Thanks for reopening the issue :octocat:✨<br/>Hope this issue will be fixed.😋🎊`;


  // Post a comment on the opening pull request
  return await context.octokit.issues.createComment({
    owner,
    repo,
    issue_number,
    body,
  });
};



module.exports = {
  issueCreate,
  issueAssign,
  issueEdit,
  issueAddLabel,
  issueClose,
  issueReopened
};
