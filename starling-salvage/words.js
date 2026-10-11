const WORDS = `
1|abundant|plentiful|scarce,hidden,ordinary|The garden had an abundant supply of tomatoes.
1|cautious|careful|careless,curious,cheerful|The cautious climber checked every foothold.
1|reluctant|unwilling|eager,unable,unaware|She was reluctant to leave the warm cabin.
1|weary|tired|worried,wealthy,angry|The weary hikers stopped to rest.
1|scarce|rare|broken,plentiful,bright|Fresh water was scarce in the desert.
1|fragile|delicate|flexible,sturdy,valuable|The fragile glass broke when it fell.
1|swift|quick|quiet,careful,small|A swift runner passed us.
1|sturdy|strong|heavy,weak,beautiful|The sturdy bridge held the truck.
1|vacant|empty|distant,untidy,occupied|We found a vacant seat.
1|conceal|hide|discover,carry,repair|Clouds conceal the mountain peak.
1|assist|help|observe,delay,refuse|Please assist me with this heavy box.
1|purchase|buy|sell,borrow,choose|She saved enough money to purchase a bicycle.
1|drowsy|sleepy|hungry,restless,confused|The warm room made him drowsy.
1|timid|shy|rude,bold,patient|The timid kitten hid behind a chair.
1|vast|immense|empty,narrow,nearby|A vast ocean stretched before us.
1|gloomy|dreary|joyful,crowded,ancient|The gloomy room needed more light.
1|genuine|authentic|expensive,false,unusual|The museum verified that the coin was genuine.
1|eager|enthusiastic|hesitant,exhausted,polite|The eager volunteers arrived early.
1|frequent|common|distant,rare,brief|Rain is frequent here in spring.
1|brief|short|clear,boring,loud|We had a brief conversation before class.
2|diminish|decrease|measure,improve,disappear|The noise began to diminish as the crowd left.
2|obstinate|stubborn|confused,obedient,thoughtful|The obstinate mule refused to move.
2|prudent|sensible|reckless,wealthy,curious|Saving some money for emergencies is prudent.
2|impartial|unbiased|uncertain,unfair,uninterested|An impartial judge treats both sides fairly.
2|tedious|boring|difficult,exciting,brief|Copying the long list was tedious work.
2|vivid|striking|faint,ordinary,accurate|She painted the sunset in vivid colors.
2|cordial|friendly|formal,hostile,timid|Our new neighbors gave us a cordial welcome.
2|frugal|thrifty|greedy,wasteful,poor|A frugal shopper avoids unnecessary purchases.
2|hostile|unfriendly|unfamiliar,helpful,frightened|The hostile crowd shouted at the visitors.
2|prosper|thrive|struggle,travel,compete|With enough sunlight the plants prosper.
2|retain|keep|return,replace,release|You may retain a copy of the letter.
2|omit|exclude|forget,include,repeat|Omit your name from the anonymous survey.
2|hinder|obstruct|assist,follow,notice|Deep snow can hinder travel.
2|resolve|settle|avoid,repeat,describe|The two friends worked to resolve their disagreement.
2|perceive|notice|predict,ignore,imagine|Did you perceive a change in her voice?
2|conventional|traditional|convenient,unusual,expensive|They chose a conventional design rather than an experimental one.
2|adapt|adjust|adopt,resist,remove|Animals must adapt to changes in their habitat.
2|tranquil|peaceful|empty,exciting,lonely|The tranquil lake reflected the morning sky.
2|stifle|suppress|encourage,produce,explain|He tried to stifle a laugh during the speech.
2|essential|necessary|helpful,ordinary,optional|Water is essential for life.
2|modest|humble|ashamed,arrogant,timid|Despite her success the athlete remained modest.
2|elaborate|detailed|expensive,simple,confusing|The architect drew an elaborate plan.
2|durable|lasting|temporary,flexible,heavy|We needed durable boots for the long trip.
2|remote|distant|deserted,nearby,ancient|The remote village was far from any city.
2|sufficient|adequate|excessive,scarce,perfect|We have sufficient food for everyone.
2|tolerate|endure|enjoy,forbid,ignore|The plant can tolerate a little frost.
2|candid|frank|rude,secretive,cheerful|She gave a candid account of her mistake.
2|diligent|industrious|talented,careless,fortunate|The diligent student checked each answer carefully.
2|ambiguous|unclear|incorrect,obvious,unusual|The ambiguous directions had two possible meanings.
2|indignant|resentful|delighted,uncertain,ashamed|He felt indignant when he was unfairly blamed.
2|lavish|extravagant|generous,simple,tiny|The lavish celebration included fireworks and a huge feast.
2|meager|scanty|stale,ample,ordinary|The hikers shared a meager meal of a few crackers.
2|relentless|persistent|careless,gentle,brief|The relentless rain continued for days.
2|verify|confirm|guess,deny,announce|Check the original document to verify the date.
2|anticipate|expect|remember,prevent,desire|We anticipate heavy traffic tomorrow.
2|concur|agree|argue,compete,explain|Both scientists concur that more evidence is needed.
3|benevolent|kindhearted|wealthy,stern,selfish|The benevolent neighbor brought meals to people in need.
3|meticulous|thorough|hurried,creative,anxious|Her meticulous inspection found even tiny cracks.
3|reticent|reserved|rude,talkative,unaware|The reticent traveler said little about himself.
3|resilient|adaptable|rigid,delicate,powerful|The resilient team recovered quickly after its defeat.
3|superfluous|unnecessary|abundant,essential,hidden|Remove the superfluous words to make the sentence clearer.
3|transient|temporary|moving,permanent,unexpected|The pain was transient and soon faded.
3|plausible|believable|proven,impossible,amusing|Her explanation sounded plausible but needed evidence.
3|scrutinize|examine|criticize,glance,conceal|The jeweler will scrutinize the stone for flaws.
3|alleviate|ease|cure,worsen,conceal|A cool cloth can alleviate the discomfort.
3|exasperate|irritate|confuse,delight,frighten|Repeated interruptions can exasperate a speaker.
3|relinquish|surrender|borrow,retain,discover|The champion refused to relinquish the trophy.
3|augment|increase|replace,decrease,measure|A second battery will augment the power supply.
3|arbitrary|capricious|logical,strict,deliberate|The arbitrary rule seemed based on a whim.
3|eloquent|expressive|talkative,silent,truthful|The eloquent speaker moved the audience with her words.
3|equitable|fair|identical,equal,profitable|They sought an equitable agreement that treated everyone justly.
3|austere|plain|ancient,comfortable,ornate|The austere room contained only a bed and a chair.
3|apathetic|indifferent|exhausted,furious,enthusiastic|The apathetic crowd showed no interest in the result.
3|concise|succinct|incomplete,complicated,accurate|Her concise answer conveyed the idea in a few words.
3|conspicuous|noticeable|beautiful,hidden,important|His orange coat was conspicuous in the snow.
3|deference|respect|fear,agreement,neglect|The students listened with deference to the experienced guide.
3|disdain|contempt|envy,admiration,doubt|She showed disdain for people she considered beneath her.
3|emulate|imitate|surpass,admire,avoid|Young players often emulate their favorite athletes.
3|feasible|practical|certain,impressive,impossible|The plan is feasible with our current budget.
3|furtive|secretive|hurried,obvious,frightened|He cast a furtive glance at the hidden note.
3|impetuous|impulsive|energetic,cautious,angry|Her impetuous decision was made without considering the risks.
3|incessant|continuous|frequent,occasional,annoying|The incessant buzzing never stopped.
3|innate|inborn|learned,obvious,unusual|The animal has an innate instinct to seek shelter.
3|lucid|clear|bright,confusing,brief|The lucid explanation was easy to understand.
3|mundane|ordinary|boring,remarkable,ancient|She finished mundane tasks such as washing dishes.
3|novice|beginner|expert,visitor,competitor|Even a novice can learn this simple tune.
3|obsolete|outdated|broken,ancient,modern|New technology made the old device obsolete.
3|ornate|decorative|expensive,plain,delicate|The ornate frame was covered with carved flowers.
3|profound|deep|confusing,shallow,obvious|The discovery had a profound effect on her thinking.
3|revere|venerate|fear,imitate,dislike|Many people revere the leader for her courage.
3|sporadic|occasional|frequent,steady,sudden|Sporadic showers interrupted the sunny afternoon.
3|tenacious|determined|careless,uncertain,aggressive|The tenacious explorer kept searching despite setbacks.
3|venerable|respected|elderly,wealthy,feeble|The venerable scholar was admired for decades of work.
3|vigilant|watchful|suspicious,sleepy,alarmed|A vigilant lifeguard watches swimmers closely.
3|zealous|fervent|jealous,careless,reluctant|The zealous supporters worked tirelessly for their cause.
3|adversity|hardship|opposition,success,confusion|The family supported one another through adversity.
`.trim().split('\n').map((line,id)=>{const [level,word,answer,wrong,example]=line.split('|');return {id,level:+level,word,answer,wrong:wrong.split(','),example}});
if(typeof module!=='undefined')module.exports=WORDS;
