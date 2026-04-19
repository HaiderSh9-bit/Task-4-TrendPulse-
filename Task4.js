const database = {
  p1: {
    id: "p1",
    author: { name: "Mira", email: "mira@trendpulse.dev", verified: true },
    content: "Meet @sara at the hub #js #async",
    engagement: { likes: 12, shares: 2, comments: 4 },
    createdAt: "2026-04-01T09:00:00.000Z"
  },
  p2: {
    id: "p2",
    author: { name: "Rami", email: "invalid-email", verified: false },
    content: "Checkout #node tutorials",
    engagement: { likes: 3 },
    createdAt: "2026-04-02T11:30:00.000Z"
  }
};

//               ----------------Rich post model-----------------

function describePostForUi(post) {
  const merged = {
    ...post,
    meta: { channel: "web" } };

  const { author: { name: authorName } = {} } = merged;
  const keysCount = Object.keys(merged).length;
  const title = merged.id;
  return { title, authorName, keysCount };
}


//           ---------------- Safe nested reads----------------

function getEngagementTotals(post) {

  const likes = post.engagement?.likes ?? 0;
  const shares = post.engagement?.shares ?? 0;
  const comments = post.engagement?.comments ?? 0;

  return { likes, shares, comments };

}



//           ----------------Simulated async fetch-----------------

function fetchPostById(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (database[id]) {

        resolve({ ...database[id] });
      } 
      else {
        reject("NOT_FOUND");
      }
    }, 30); 
  }
);
}

//                     -----------------async function demoFetch-----------------------

async function demoFetch(id) {
  try {
    const post = await fetchPostById(id);
    console.log("Loaded post:", post);
  } catch (e) {
    console.log("Error:", e);
  } finally {
    console.log("done");
  }
}

//              ------------Regex: email, hashtags, mentions-------------
// regex patterns

const emailRegex = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
const hashTagRegex = /#[\w؀-ۿ]+/g;
const mentionRegex = /@[\w]+/g;

function analyzePostText(post) {

  const emailValid = emailRegex.test(post.author?.email ?? "");
  const tags = post.content?.match(hashTagRegex) ?? [];
  const mentions = post.content?.match(mentionRegex) ?? [];

  return { emailValid, tags, mentions };

}


//                           ------------Event loop: predict order-------------

console.log("1"); 

setTimeout(() => console.log("2"), 0); 

Promise.resolve().then(() => console.log("3")); 

console.log("4");

// expected outcome
// 1
// 4
// 3
// 2


//                  -------------------DAte format+livve refresh timer--------------------------

function formatIsoDateOnly(iso) {
  const d = new Date(iso);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function startRefreshDemo(onTick) {
  let n = 0;

  const id = setInterval(() => {
    n++;
    onTick(n);

    if (n >= 3) {
      clearInterval(id); 
    }
  }, 200); 
}


//                    ----------------------Final orchestrator--------------

async function runTrendPulsePhase2() {
  const ids = ["p1", "p2"];

  let loaded = 0;
  let validEmails = 0;
  let invalidAuthorId = null;
  let datesFormatted = [];

  for (const id of ids) {
    try {
      const post = await fetchPostById(id); 
      loaded++;

      if (analyzePostText(post).emailValid) {
        validEmails++;
      } else if (invalidAuthorId === null) {
        invalidAuthorId = post.id;
      }

      const formattedDate = formatIsoDateOnly(post.createdAt);
      datesFormatted.push(formattedDate);

    } catch (err) {
      console.error(`Error loading ${id}:`, err);
    }
  }
  return { loaded, validEmails, invalidAuthorId, datesFormatted };
}





// const postExample = {
//   id: "p1",
//   author: { name: "Mira", email: "mira@trendpulse.dev", verified: true },
//   content: "hi"
// };

// console.log(describePostForUi(postExample));

// const x = { engagement: { likes: 5, shares: 1 } };
// const y = { engagement: { likes: 2 } };
// const z = {}; 

// console.log(getEngagementTotals(x)); // { likes: 5, shares: 1, comments: 0 }
// console.log(getEngagementTotals(y)); // { likes: 2, shares: 0, comments: 0 }
// console.log(getEngagementTotals(z)); // { likes: 0, shares: 0, comments: 0 }

// console.log(analyzePostText(database.p1));
// console.log(analyzePostText(database.p2));
// console.log(formatIsoDateOnly("2026-04-04T10:00:00.000Z")); 
// startRefreshDemo((tick) => {
//   console.log("Tick:", tick);
// });
// runTrendPulsePhase2().then(result => console.log(result));
