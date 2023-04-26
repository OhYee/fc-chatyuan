
import time
import hashlib
import json
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware


p = None
initializing = False


def getPipeline():
    global p, initializing

    if p == None:
        if initializing == True:
            while p == None:
                time.sleep(500)
        else:
            initializing = True

            print("start load model")

            from modelscope.pipelines import pipeline
            from modelscope.utils.constant import Tasks
            from modelscope.models.nlp import T5ForConditionalGeneration
            from modelscope.preprocessors import TextGenerationT5Preprocessor

            model = T5ForConditionalGeneration.from_pretrained(
                'ClueAI/ChatYuan-large', revision='v1.0.0')
            preprocessor = TextGenerationT5Preprocessor(model.model_dir)

            # p = pipeline('text2text-generation', 'ClueAI/ChatYuan-large-v2')
            p = pipeline(
                task=Tasks.text2text_generation, model=model, preprocessor=preprocessor)
            print("load model success")
    return p


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/chat")
def chat(history=Body(), top_p=1, temperature=0.7, no_repeat_ngram_size=3):
    history = json.loads(history)
    context = "\\n".join([
        "用户: %s" % item["content"] if item["user"] == True else "小元: %s" % item["content"]
        for item in history
    ])

    return direct(context, top_p=top_p, temperature=temperature, no_repeat_ngram_size=no_repeat_ngram_size)


@app.get("/question")
def question(question: str, top_p=1, temperature=0.7, no_repeat_ngram_size=3):
    context = "提问：%s\\n回答：" % question

    return direct(context, top_p=top_p, temperature=temperature, no_repeat_ngram_size=no_repeat_ngram_size)


@app.get("/direct")
def direct(context: str, top_p=1, temperature=0.7, no_repeat_ngram_size=3):
    print(context)
    return getPipeline()(context, return_dict_in_generate=True, output_scores=True,
                         do_sample=True, top_p=float(top_p), temperature=float(temperature), no_repeat_ngram_size=int(no_repeat_ngram_size))


if __name__ == "__main__":
    print(chat([
        {"user": True, "content": "你好"},
        {"user": False, "content": "你好！"},
        {"user": True, "content": "你知道什么是驼峰命名法吗？"},
    ]))
